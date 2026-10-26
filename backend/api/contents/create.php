<?php
/**
 * KnowledgeHub API — Create / Submit Content
 * Path: /api/contents/create.php
 * 
 * Allows registered users to submit content for administrator review.
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

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

$authUser = getAuthUser();
if (!$authUser) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'You must be signed in to submit content.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$title       = trim($input['title'] ?? '');
$categoryId  = isset($input['category_id']) ? (int)$input['category_id'] : 0;
$contentType = trim($input['content_type'] ?? 'text');
$authorName  = trim($input['author_name'] ?? '');
$bodyText    = trim($input['body_text'] ?? '');
$filePath    = trim($input['file_path'] ?? '');

if (empty($title)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Title is required.']);
    exit;
}

if ($categoryId <= 0) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please select a valid category.']);
    exit;
}

if (!in_array($contentType, ['text', 'pdf'], true)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Invalid content type.']);
    exit;
}

if ($contentType === 'text' && empty($bodyText)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please provide the text content for your submission.']);
    exit;
}

if ($contentType === 'pdf' && empty($filePath)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please upload a PDF document before submitting.']);
    exit;
}

if (empty($authorName)) {
    $authorName = $authUser['username'];
}

try {
    $pdo = getDB();

    $stmt = $pdo->prepare('
        INSERT INTO contents (user_id, category_id, title, author_name, content_type, body_text, file_path, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, "pending")
    ');

    $stmt->execute([
        (int)$authUser['id'],
        $categoryId,
        $title,
        $authorName,
        $contentType,
        $bodyText ?: null,
        $filePath ?: null,
    ]);

    $contentId = (int)$pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Your submission was received and is currently awaiting administrator review.',
        'data'    => [
            'id'           => $contentId,
            'title'        => $title,
            'status'       => 'pending',
            'created_at'   => date('Y-m-d H:i:s')
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save submission: ' . $e->getMessage()]);
}
