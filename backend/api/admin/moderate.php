<?php
/**
 * KnowledgeHub API — Admin Moderate Submission Endpoint
 * Path: /api/admin/moderate.php
 * 
 * Approve or reject pending user submissions.
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
if (!$authUser || $authUser['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Administrator privileges required.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$contentId = isset($input['content_id']) ? (int)$input['content_id'] : 0;
$action    = strtolower(trim($input['action'] ?? ''));
$notes     = trim($input['notes'] ?? '');

if ($contentId <= 0) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Valid Content ID is required.']);
    exit;
}

if (!in_array($action, ['approve', 'reject', 'pending'], true)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Action must be "approve", "reject", or "pending".']);
    exit;
}

$newStatus = ($action === 'approve') ? 'approved' : (($action === 'reject') ? 'rejected' : 'pending');

try {
    $pdo = getDB();

    $stmt = $pdo->prepare('UPDATE contents SET status = ?, admin_notes = ? WHERE id = ?');
    $stmt->execute([$newStatus, $notes ?: null, $contentId]);

    if ($stmt->rowCount() === 0) {
        // Check if content exists
        $check = $pdo->prepare('SELECT id FROM contents WHERE id = ?');
        $check->execute([$contentId]);
        if (!$check->fetch()) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Submission not found.']);
            exit;
        }
    }

    echo json_encode([
        'status'  => 'success',
        'message' => "Content item #{$contentId} has been {$newStatus}.",
        'data'    => [
            'content_id'  => $contentId,
            'status'      => $newStatus,
            'admin_notes' => $notes,
            'moderated_by'=> $authUser['username']
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Moderation update failed: ' . $e->getMessage()]);
}
