<?php
/**
 * KnowledgeHub API — Approved Content List Endpoint
 * Path: /api/contents/list.php
 * 
 * Supports query parameters:
 *  - category: category slug or id
 *  - search: keyword search in title, author, or text
 *  - type: 'text' or 'pdf'
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

    $category = trim($_GET['category'] ?? '');
    $search   = trim($_GET['search'] ?? '');
    $type     = trim($_GET['type'] ?? '');

    $where = ["cnt.status = 'approved'"];
    $params = [];

    // Filter by Category (slug or numeric ID)
    if (!empty($category) && $category !== 'all') {
        if (is_numeric($category)) {
            $where[] = "cnt.category_id = ?";
            $params[] = (int)$category;
        } else {
            $where[] = "cat.slug = ?";
            $params[] = $category;
        }
    }

    // Filter by Content Type ('text' or 'pdf')
    if (!empty($type) && in_array($type, ['text', 'pdf'], true)) {
        $where[] = "cnt.content_type = ?";
        $params[] = $type;
    }

    // Keyword Search
    if (!empty($search)) {
        $where[] = "(cnt.title LIKE ? OR cnt.author_name LIKE ? OR cnt.body_text LIKE ?)";
        $searchTerm = "%{$search}%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    $whereClause = implode(' AND ', $where);

    $sql = "
        SELECT 
            cnt.id,
            cnt.title,
            cnt.author_name,
            cnt.content_type,
            cnt.body_text,
            cnt.file_path,
            cnt.status,
            cnt.created_at,
            cat.name AS category_name,
            cat.slug AS category_slug,
            u.username AS contributor_username
        FROM contents cnt
        LEFT JOIN categories cat ON cat.id = cnt.category_id
        LEFT JOIN users u ON u.id = cnt.user_id
        WHERE {$whereClause}
        ORDER BY cnt.created_at DESC
        LIMIT 100
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    // Map excerpt safely
    $contents = array_map(function($item) {
        $text = (string)($item['body_text'] ?? '');
        $item['excerpt'] = mb_strlen($text) > 160 ? mb_substr($text, 0, 160) . '...' : $text;
        return $item;
    }, $rows);

    echo json_encode([
        'status' => 'success',
        'count'  => count($contents),
        'data'   => $contents
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch content list: ' . $e->getMessage()]);
}
