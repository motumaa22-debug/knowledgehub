<?php
/**
 * KnowledgeHub — Root Health Check & Welcome Endpoint
 * Responds to Render's root health probe (HEAD / and GET /) with 200 OK
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'HEAD') {
    http_response_code(200);
    exit;
}

http_response_code(200);
echo json_encode([
    'status'    => 'healthy',
    'app'       => 'KnowledgeHub Backend',
    'endpoints' => [
        'api'    => '/api/index.php',
        'health' => '/api/health.php',
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
