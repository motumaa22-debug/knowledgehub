<?php
/**
 * KnowledgeHub API — Root Endpoint / Health Check
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

echo json_encode([
    'status'      => 'online',
    'app'         => 'KnowledgeHub — Digital Knowledge Library API',
    'version'     => '1.0.0',
    'timestamp'   => date('c'),
    'endpoints'   => [
        'auth'       => '/auth (register, login, logout, me)',
        'categories' => '/categories (list)',
        'contents'   => '/contents (list, details, create, my-submissions, upload)',
        'admin'      => '/admin (pending, moderate)'
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
