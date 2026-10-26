<?php
/**
 * KnowledgeHub API — Categories List Endpoint
 * Path: /api/categories/list.php
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

try {
    $pdo = getDB();
    $stmt = $pdo->query('
        SELECT c.id, c.name, c.slug, c.description,
               COUNT(cnt.id) as content_count
        FROM categories c
        LEFT JOIN contents cnt ON cnt.category_id = c.id AND cnt.status = "approved"
        GROUP BY c.id, c.name, c.slug, c.description
        ORDER BY c.id ASC
    ');
    $categories = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'count'  => count($categories),
        'data'   => $categories
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch categories: ' . $e->getMessage()]);
}
