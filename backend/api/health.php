<?php
/**
 * KnowledgeHub — Cloud Backend & Database Diagnostic Health Check
 * Path: /api/health.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$startTime = microtime(true);
$diagnostics = [
    'status'       => 'unknown',
    'timestamp'    => date('Y-m-d H:i:s T'),
    'php_version'  => phpversion(),
    'version'      => 'v2.1-streamlined-auth',
    'environment'  => [
        'db_host_configured' => !empty(getenv('DB_HOST')),
        'db_name_configured' => !empty(getenv('DB_NAME')),
        'db_user_configured' => !empty(getenv('DB_USER')),
        'jwt_secret_set'     => !empty(getenv('JWT_SECRET')),
        'mail_user_set'      => !empty(getenv('MAIL_USER') ?: getenv('MAIL_USERNAME')),
    ],
    'database'     => [
        'connected' => false,
        'latency_ms' => null,
        'users_table_exists' => false,
        'admin_user_found'   => false,
        'admin_verified'     => false,
        'categories_count'   => 0,
        'contents_count'     => 0,
        'error'              => null,
    ],
];

require_once __DIR__ . '/../config/database.php';

try {
    $dbStart = microtime(true);
    $pdo = getDB();
    $diagnostics['database']['connected'] = true;
    $diagnostics['database']['latency_ms'] = round((microtime(true) - $dbStart) * 1000, 2);

    // Check users table
    try {
        $userCheck = $pdo->query("SELECT id, username, role, is_verified FROM users WHERE username = 'admin' LIMIT 1")->fetch();
        $diagnostics['database']['users_table_exists'] = true;
        if ($userCheck) {
            $diagnostics['database']['admin_user_found'] = true;
            $diagnostics['database']['admin_verified'] = (int)$userCheck['is_verified'] === 1;

            // Ensure admin is verified
            if ((int)$userCheck['is_verified'] !== 1) {
                $pdo->prepare("UPDATE users SET is_verified = 1 WHERE username = 'admin'")->execute();
                $diagnostics['database']['admin_verified'] = true;
            }
        }
    } catch (Throwable $e) {
        $diagnostics['database']['user_query_error'] = $e->getMessage();
    }

    // Check counts
    try {
        $catCount = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
        $diagnostics['database']['categories_count'] = (int)$catCount;
    } catch (Throwable $e) {}

    try {
        $cntCount = $pdo->query("SELECT COUNT(*) FROM contents")->fetchColumn();
        $diagnostics['database']['contents_count'] = (int)$cntCount;
    } catch (Throwable $e) {}

    $diagnostics['status'] = $diagnostics['database']['admin_user_found'] ? 'healthy' : 'warning';

} catch (Throwable $e) {
    $diagnostics['status'] = 'database_error';
    $diagnostics['database']['error'] = $e->getMessage();
}

$diagnostics['total_execution_ms'] = round((microtime(true) - $startTime) * 1000, 2);

http_response_code($diagnostics['status'] === 'database_error' ? 500 : 200);
echo json_encode($diagnostics, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
