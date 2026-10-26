<?php
/**
 * KnowledgeHub API — Multilingual Translation Endpoint
 * Path: /api/translate/translate.php
 * 
 * Supports two-way translation between:
 *  - Afaan Oromoo (om)
 *  - English (en)
 *  - Amharic (am)
 */

require_once __DIR__ . '/../../config/cors.php';

// Accept both POST (JSON/form) and GET requests
$text = '';
$sourceLang = 'auto';
$targetLang = 'en';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (is_array($data)) {
        $text = trim($data['text'] ?? '');
        $sourceLang = trim($data['source_lang'] ?? 'auto');
        $targetLang = trim($data['target_lang'] ?? 'en');
    } else {
        $text = trim($_POST['text'] ?? '');
        $sourceLang = trim($_POST['source_lang'] ?? 'auto');
        $targetLang = trim($_POST['target_lang'] ?? 'en');
    }
} else {
    $text = trim($_GET['text'] ?? '');
    $sourceLang = trim($_GET['source_lang'] ?? 'auto');
    $targetLang = trim($_GET['target_lang'] ?? 'en');
}

if ($text === '') {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please provide non-empty text to translate.'
    ]);
    exit;
}

// Normalize language codes
$validLangs = ['en' => 'English', 'om' => 'Afaan Oromoo', 'am' => 'Amharic'];

$sourceLang = strtolower($sourceLang);
$targetLang = strtolower($targetLang);

if ($sourceLang !== 'auto' && !array_key_exists($sourceLang, $validLangs)) {
    http_response_code(422);
    echo json_encode([
        'status' => 'error',
        'message' => "Unsupported source language '$sourceLang'. Supported: en, om, am."
    ]);
    exit;
}

if (!array_key_exists($targetLang, $validLangs)) {
    http_response_code(422);
    echo json_encode([
        'status' => 'error',
        'message' => "Unsupported target language '$targetLang'. Supported: en, om, am."
    ]);
    exit;
}

// If same language, return original text directly
if ($sourceLang === $targetLang) {
    echo json_encode([
        'status' => 'success',
        'source_lang' => $sourceLang,
        'target_lang' => $targetLang,
        'original_text' => $text,
        'translated_text' => $text,
        'engine' => 'identity'
    ]);
    exit;
}

/**
 * Helper to make HTTP GET request using cURL or file_get_contents
 */
function fetchRemoteUrl($url, $timeout = 6) {
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KnowledgeHub/1.0');
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode >= 200 && $httpCode < 300 && $result !== false) {
            return $result;
        }
    }

    $ctx = stream_context_create([
        'http' => [
            'timeout' => $timeout,
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KnowledgeHub/1.0'
        ]
    ]);
    return @file_get_contents($url, false, $ctx);
}

/**
 * Strategy 1: Google Translate GTX Single Engine
 */
function translateWithGoogleGtx($text, $source, $target) {
    $sl = ($source === 'auto') ? 'auto' : $source;
    $tl = $target;
    $url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' 
        . urlencode($sl) . '&tl=' . urlencode($tl) . '&dt=t&q=' . urlencode($text);

    $raw = fetchRemoteUrl($url, 5);
    if ($raw) {
        $json = json_decode($raw, true);
        if (is_array($json) && isset($json[0]) && is_array($json[0])) {
            $translated = '';
            foreach ($json[0] as $segment) {
                if (isset($segment[0])) {
                    $translated .= $segment[0];
                }
            }
            $detectedSource = $json[2] ?? $source;
            if (trim($translated) !== '') {
                return [
                    'translated' => $translated,
                    'detected_source' => $detectedSource,
                    'engine' => 'google'
                ];
            }
        }
    }
    return null;
}

/**
 * Strategy 2: MyMemory API Fallback
 */
function translateWithMyMemory($text, $source, $target) {
    $src = ($source === 'auto') ? 'autodetect' : $source;
    $url = 'https://api.mymemory.translated.net/get?q=' . urlencode($text) . '&langpair=' . urlencode($src) . '|' . urlencode($target);

    $raw = fetchRemoteUrl($url, 5);
    if ($raw) {
        $json = json_decode($raw, true);
        if (isset($json['responseData']['translatedText']) && trim($json['responseData']['translatedText']) !== '') {
            return [
                'translated' => $json['responseData']['translatedText'],
                'detected_source' => $source,
                'engine' => 'mymemory'
            ];
        }
    }
    return null;
}

/**
 * Strategy 3: Built-in Cultural & Idiomatic Knowledge Dictionary Fallback
 */
function translateWithDictionary($text, $source, $target) {
    static $dictionary = [
        // Greetings & Essentials
        'hello' => ['en' => 'Hello', 'om' => 'Akkam', 'am' => 'ሰላም'],
        'peace' => ['en' => 'Peace', 'om' => 'Nagaa', 'am' => 'ሰላም'],
        'welcome' => ['en' => 'Welcome', 'om' => 'Baga nagaan dhuftan', 'am' => 'እንኳን ደህና መጡ'],
        'thank you' => ['en' => 'Thank you', 'om' => 'Galatoomaa', 'am' => 'አመሰግናለሁ'],
        'knowledge' => ['en' => 'Knowledge', 'om' => 'Beekumsa', 'am' => 'እውቀት'],
        'book' => ['en' => 'Book', 'om' => 'Kitaaba', 'am' => 'መጽሐፍ'],
        'library' => ['en' => 'Library', 'om' => 'Kuusaa Kitaabaa', 'am' => 'ቤተ-መጻሕፍት'],
        'proverb' => ['en' => 'Proverb', 'om' => 'Mammaaksa', 'am' => 'ምሳሌያዊ አነጋገር'],
        'poem' => ['en' => 'Poem', 'om' => 'Walaloo', 'am' => 'ግጥም'],
        'wisdom' => ['en' => 'Wisdom', 'om' => 'Ogeessummaa', 'am' => 'ጥበብ'],
        'light' => ['en' => 'Light', 'om' => 'Ifa', 'am' => 'ብርሃን'],
        'truth' => ['en' => 'Truth', 'om' => 'Dhugaa', 'am' => 'እውነት'],
        'knowledge is light' => ['en' => 'Knowledge is light', 'om' => 'Beekumsi ifa', 'am' => 'እውቀት ብርሃን ነው'],
        'peace and health to all' => ['en' => 'Peace and health to all', 'om' => 'Nagaa fi fayyaa hundaaf', 'am' => 'ሰላም እና ጤና ለሁላችሁ ይሁን'],
        'how are you' => ['en' => 'How are you?', 'om' => 'Akkam jirtu?', 'am' => 'እንደምን አላችሁ?']
    ];

    $clean = mb_strtolower(trim(preg_replace('/[?.!,]/', '', $text)));
    if (isset($dictionary[$clean]) && isset($dictionary[$clean][$target])) {
        return [
            'translated' => $dictionary[$clean][$target],
            'detected_source' => $source,
            'engine' => 'dictionary'
        ];
    }

    return null;
}

// Execute Translation Pipeline
$result = translateWithGoogleGtx($text, $sourceLang, $targetLang);

if (!$result) {
    $result = translateWithMyMemory($text, $sourceLang, $targetLang);
}

if (!$result) {
    $result = translateWithDictionary($text, $sourceLang, $targetLang);
}

if ($result) {
    echo json_encode([
        'status' => 'success',
        'source_lang' => $result['detected_source'] ?? $sourceLang,
        'target_lang' => $targetLang,
        'source_label' => $validLangs[$result['detected_source'] ?? $sourceLang] ?? $sourceLang,
        'target_label' => $validLangs[$targetLang] ?? $targetLang,
        'original_text' => $text,
        'translated_text' => $result['translated'],
        'engine' => $result['engine']
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} else {
    // If all fail, return clean message with original
    echo json_encode([
        'status' => 'fallback',
        'source_lang' => $sourceLang,
        'target_lang' => $targetLang,
        'original_text' => $text,
        'translated_text' => $text,
        'engine' => 'none',
        'message' => 'Online translation service temporarily unreachable. Returning original text.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
