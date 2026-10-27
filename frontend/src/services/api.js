/**
 * KnowledgeHub API Client
 * Centralized fetch client for backend communication with JSON responses.
 */

let rawBase = import.meta.env.VITE_API_BASE_URL || '';

// Clean up any stray quotes, spaces, or trailing slashes
rawBase = rawBase.trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '');

// Auto-correct missing -8wwr suffix if user configured the generic name
let correctedBase = rawBase.includes('knowledgehub-backend.onrender.com') && !rawBase.includes('-8wwr')
  ? rawBase.replace('knowledgehub-backend.onrender.com', 'knowledgehub-backend-8wwr.onrender.com')
  : rawBase;

// Fallback to production backend URL if empty or local placeholder on cloud
let determinedBase = correctedBase;
if (!determinedBase || (determinedBase.includes('localhost') && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
  determinedBase = 'https://knowledgehub-backend-8wwr.onrender.com/api';
}

// CRITICAL: Ensure URL always has a scheme (http:// or https://)
// Without https://, browsers treat "knowledgehub-backend-8wwr.onrender.com" as a relative path
// on the frontend host (e.g. https://knowledgehub-frontend.onrender.com/knowledgehub-backend...),
// causing 404s and empty 200 responses!
if (!determinedBase.startsWith('http://') && !determinedBase.startsWith('https://')) {
  if (determinedBase.includes('localhost') || determinedBase.includes('127.0.0.1')) {
    determinedBase = `http://${determinedBase}`;
  } else {
    determinedBase = `https://${determinedBase}`;
  }
}

// Strip any trailing slashes again
determinedBase = determinedBase.replace(/\/+$/, '');

// Ensure /api is ALWAYS present at the end
if (!determinedBase.endsWith('/api')) {
  determinedBase = `${determinedBase}/api`;
}

export const API_BASE_URL = determinedBase;

/**
 * Universal fetch wrapper
 * @param {string} endpoint - Relative path (e.g. '/contents/list.php')
 * @param {object} options - Fetch options (method, body, headers)
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  console.log(`[KnowledgeHub API] ${options.method || 'GET'} -> ${url}`);
  
  const token = localStorage.getItem('kh_token');
  const headers = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // If body is plain object, serialize to JSON unless FormData
  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  // 90-second timeout to handle Render free-tier cold starts (which can take 50–75s) without prematurely aborting
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 90000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const rawText = await response.text();
    console.log(`[KnowledgeHub API] Raw response from ${endpoint} (status ${response.status}):`, rawText.substring(0, 500));

    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch (_) {
      data = null;
    }

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    if (!data) {
      if (!rawText.trim()) {
        throw new Error(`Server returned an empty response (status ${response.status}) from: ${url}`);
      }
      throw new Error(`Server returned invalid response: ${rawText.substring(0, 100)}`);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn(`[KnowledgeHub API] Request to ${endpoint} timed out. Cloud backend may be waking up.`);
      throw new Error('Server is currently waking up from cold sleep. Please wait a few moments and try again.');
    }
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export default {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};
