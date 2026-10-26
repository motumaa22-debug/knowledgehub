<?php
/**
 * KnowledgeHub API — User Submissions Endpoint
 * Path: /api/contents/my-submissions.php
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

$authUser = getAuthUser();
if (!$authUser) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized. Please log in.']);
    exit;
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare('
        SELECT 
            cnt.id,
            cnt.title,
            cnt.content_type,
            cnt.status,
            cnt.admin_notes,
            cnt.created_at,
            cat.name AS category_name,
            cat.slug AS category_slug
        FROM contents cnt
        LEFT JOIN categories cat ON cat.id = cnt.category_id
        WHERE cnt.user_id = ?
        ORDER BY cnt.created_at DESC
    ');
    $stmt->execute([(int)$authUser['id']]);
    $submissions = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'count'  => count($submissions),
        'data'   => $submissions
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch user submissions: ' . $e->getMessage()]);
}
