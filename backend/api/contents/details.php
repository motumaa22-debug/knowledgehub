<?php
/**
 * KnowledgeHub API — Single Content Details Endpoint
 * Path: /api/contents/details.php?id={id}
 * 
 * Access Control: Enforces member registration.
 * Only registered & authenticated members can read full text and details of library items.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

// Verify member authentication
$authUser = getAuthUser();
if (!$authUser) {
    http_response_code(401);
    echo json_encode([
        'status'  => 'auth_required',
        'message' => 'Member registration required. Please sign in or register to read this publication and access library archives.'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing content ID.']);
    exit;
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare('
        SELECT 
            cnt.id,
            cnt.title,
            cnt.author_name,
            cnt.content_type,
            cnt.body_text,
            cnt.file_path,
            cnt.status,
            cnt.created_at,
            cat.id AS category_id,
            cat.name AS category_name,
            cat.slug AS category_slug,
            u.username AS contributor_username
        FROM contents cnt
        LEFT JOIN categories cat ON cat.id = cnt.category_id
        LEFT JOIN users u ON u.id = cnt.user_id
        WHERE cnt.id = ?
        LIMIT 1
    ');
    $stmt->execute([$id]);
    $item = $stmt->fetch();

    if (!$item) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Content not found.']);
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'data'   => $item
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch content details: ' . $e->getMessage()]);
}
