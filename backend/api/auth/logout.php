<?php
/**
 * KnowledgeHub API — User Logout Endpoint
 * Path: /api/auth/logout.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

echo json_encode([
    'status'  => 'success',
    'message' => 'Successfully logged out. Client token should be discarded.'
]);
