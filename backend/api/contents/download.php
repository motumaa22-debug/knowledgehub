<?php
/**
 * KnowledgeHub API — Secure Authenticated File Download Endpoint
 * Path: /api/contents/download.php?id={id}&token={token}
 * 
 * Enforces member authentication: Only registered & logged-in users
 * can download PDF publications from the library.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

// Authenticate via Bearer header or token query parameter
$authUser = getAuthUser();
if (!$authUser && !empty($_GET['token'])) {
    $authUser = verifyToken(trim($_GET['token']));
}

if (!$authUser) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status'  => 'auth_required',
        'message' => 'Member registration required. Please sign in or register to download this publication.'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status' => 'error', 'message' => 'Valid Content ID is required.']);
    exit;
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare('SELECT id, title, content_type, file_path, status, user_id FROM contents WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $content = $stmt->fetch();

    if (!$content) {
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => 'error', 'message' => 'Publication not found.']);
        exit;
    }

    if ($content['content_type'] !== 'pdf' || empty($content['file_path'])) {
        http_response_code(400);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => 'error', 'message' => 'This resource does not contain an attached PDF file.']);
        exit;
    }

    // Only allow downloading approved files, unless user is the author or admin
    $isOwner = ((int)$content['user_id'] === (int)$authUser['id']);
    $isAdmin = (($authUser['role'] ?? '') === 'admin');
    if ($content['status'] !== 'approved' && !$isOwner && !$isAdmin) {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => 'error', 'message' => 'This publication is pending administrative review.']);
        exit;
    }

    // Resolve physical storage path
    $baseStorage = realpath(__DIR__ . '/../../');
    $fullPath = realpath($baseStorage . '/' . $content['file_path']);

    if (!$fullPath || !file_exists($fullPath)) {
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => 'error', 'message' => 'Physical document file not found on library server.']);
        exit;
    }

    // Clean filename for download
    $downloadName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $content['title']) . '.pdf';
    $disposition = (!empty($_GET['view']) && $_GET['view'] == '1') ? 'inline' : 'attachment';

    // Stream PDF file
    header('Content-Description: File Transfer');
    header('Content-Type: application/pdf');
    header('Content-Disposition: ' . $disposition . '; filename="' . $downloadName . '"');
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: private, must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . filesize($fullPath));

    // Clear output buffer and stream
    ob_clean();
    flush();
    readfile($fullPath);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
