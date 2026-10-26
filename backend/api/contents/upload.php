<?php
/**
 * KnowledgeHub API — PDF File Upload Endpoint
 * Path: /api/contents/upload.php
 * 
 * Secure PDF file upload to protected server-side storage directory.
 * Disallows executable scripts, checks MIME types and extensions.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed. Use POST.']);
    exit;
}

require_once __DIR__ . '/../../config/jwt.php';

$authUser = getAuthUser();
if (!$authUser) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Please sign in to upload files.']);
    exit;
}

// Protected storage directory
$storageDir = realpath(__DIR__ . '/../../storage');

if (!$storageDir || !is_dir($storageDir)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Upload storage directory is not accessible.']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'message' => 'No file uploaded or upload error code: ' . ($_FILES['file']['error'] ?? 'missing')
    ]);
    exit;
}

$file = $_FILES['file'];
$fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Enforce strict PDF validation
if ($fileExt !== 'pdf') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid file format. Only PDF files (.pdf) are permitted.']);
    exit;
}

// Validate MIME type via finfo
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if ($mimeType !== 'application/pdf') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'MIME type verification failed. File must be a valid PDF.']);
    exit;
}

// Generate unique, safe storage filename
$safeFileName = 'doc_' . bin2hex(random_bytes(12)) . '.pdf';
$destination = $storageDir . DIRECTORY_SEPARATOR . $safeFileName;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    echo json_encode([
        'status'    => 'success',
        'message'   => 'PDF uploaded securely to protected storage.',
        'file_name' => $safeFileName,
        'file_path' => 'storage/' . $safeFileName
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save file to storage directory.']);
}
