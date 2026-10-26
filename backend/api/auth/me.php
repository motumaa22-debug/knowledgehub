<?php
/**
 * KnowledgeHub API — Current User Profile
 * Path: /api/auth/me.php
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
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized or expired session.']);
    exit;
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([(int)$authUser['id']]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'User account not found.']);
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'user'   => [
            'id'       => (int)$user['id'],
            'username' => $user['username'],
            'email'    => $user['email'],
            'role'     => $user['role']
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
