import api from './api';

/**
 * Content Service
 * Handles fetching library items, submitting text & PDF content, and admin moderation.
 */
export const contentService = {
  /**
   * Fetch approved contents with optional category, query search, and pagination
   */
  async getContents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/contents/list.php${query ? `?${query}` : ''}`;
    return api.get(endpoint);
  },

  /**
   * Fetch single content details by ID
   */
  async getContentDetails(id) {
    return api.get(`/contents/details.php?id=${id}`);
  },

  /**
   * Fetch list of active categories
   */
  async getCategories() {
    return api.get('/categories/list.php');
  },

  /**
   * Submit new text or reference content
   */
  async createContent(contentData) {
    return api.post('/contents/create.php', contentData);
  },

  /**
   * Upload supported PDF document to protected server storage
   */
  async uploadPdf(formData) {
    return api.post('/contents/upload.php', formData);
  },

  /**
   * Fetch submissions by the current logged-in user
   */
  async getMySubmissions() {
    return api.get('/contents/my-submissions.php');
  },

  /**
   * Admin: fetch pending submissions awaiting review
   */
  async getPendingSubmissions() {
    return api.get('/admin/pending.php');
  },

  /**
   * Admin: approve or reject a submission
   */
  async moderateSubmission(contentId, action, notes = '') {
    return api.post('/admin/moderate.php', {
      content_id: contentId,
      action, // 'approve' | 'reject'
      notes,
    });
  },
};

export default contentService;
