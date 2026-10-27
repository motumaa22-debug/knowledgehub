<?php
/**
 * KnowledgeHub — One-Time Admin Account Fix
 * Path: /api/admin-fix.php
 *
 * This endpoint resets the admin account password to 'password123' and marks it as verified.
 * Visit this URL ONCE after deploy to ensure admin can log in.
 * It is safe to run multiple times (idempotent).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../config/database.php';

$result = [
    'status'  => 'unknown',
    'actions' => [],
];

try {
    $pdo = getDB();

    // Fresh bcrypt hash for 'password123'
    $newHash = password_hash('password123', PASSWORD_BCRYPT);

    // Update admin: correct password hash, set is_verified=1
    $stmt = $pdo->prepare("
        UPDATE users
        SET password_hash = ?, is_verified = 1
        WHERE username = 'admin' OR role = 'admin'
    ");
    $stmt->execute([$newHash]);
    $rowsUpdated = $stmt->rowCount();

    $result['actions'][] = "Updated {$rowsUpdated} admin row(s): password_hash refreshed, is_verified=1 set.";

    // Verify admin can now be found and password matches
    $admin = $pdo->query("SELECT id, username, email, role, is_verified, password_hash FROM users WHERE username = 'admin' LIMIT 1")->fetch();
    if ($admin) {
        $passwordOk = password_verify('password123', $admin['password_hash']);
        $result['admin_found'] = true;
        $result['admin_verified'] = (int)$admin['is_verified'] === 1;
        $result['password_matches'] = $passwordOk;
        $result['status'] = ($passwordOk && (int)$admin['is_verified'] === 1) ? 'fixed' : 'partial';
    } else {
        // Admin row doesn't exist — insert it
        $insertHash = password_hash('password123', PASSWORD_BCRYPT);
        $pdo->prepare("INSERT INTO users (username, email, password_hash, role, is_verified) VALUES ('admin', 'admin@knowledgehub.org', ?, 'admin', 1)")->execute([$insertHash]);
        $result['actions'][] = 'Admin row did not exist — created fresh admin account.';
        $result['status'] = 'created';
    }

    $result['message'] = 'Admin fix complete. Login with username: admin, password: password123';

} catch (Throwable $e) {
    $result['status'] = 'error';
    $result['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
