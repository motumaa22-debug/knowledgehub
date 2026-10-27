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
    $rowsAdmin = $stmt->rowCount();

    // Update contributor: correct password hash, set is_verified=1
    $stmt = $pdo->prepare("
        UPDATE users
        SET password_hash = ?, is_verified = 1
        WHERE username = 'contributor'
    ");
    $stmt->execute([$newHash]);
    $rowsContributor = $stmt->rowCount();

    // If contributor didn't exist, create it
    if ($rowsContributor === 0) {
        $check = $pdo->query("SELECT id FROM users WHERE username = 'contributor' LIMIT 1")->fetch();
        if (!$check) {
            $pdo->prepare("INSERT INTO users (username, email, password_hash, role, is_verified) VALUES ('contributor', 'reader@knowledgehub.org', ?, 'user', 1)")
                ->execute([$newHash]);
            $result['actions'][] = 'Created contributor demo account (password: password123, verified: 1).';
        }
    }

    $result['actions'][] = "Admin updated: {$rowsAdmin} row(s). Contributor updated: {$rowsContributor} row(s).";

    // Verify admin can now be found and password matches
    $admin = $pdo->query("SELECT id, username, email, role, is_verified, password_hash FROM users WHERE username = 'admin' LIMIT 1")->fetch();
    $contributor = $pdo->query("SELECT id, username, email, role, is_verified, password_hash FROM users WHERE username = 'contributor' LIMIT 1")->fetch();

    $result['admin_found'] = (bool)$admin;
    $result['admin_verified'] = $admin ? ((int)$admin['is_verified'] === 1) : false;
    $result['admin_password_ok'] = $admin ? password_verify('password123', $admin['password_hash']) : false;

    $result['contributor_found'] = (bool)$contributor;
    $result['contributor_verified'] = $contributor ? ((int)$contributor['is_verified'] === 1) : false;
    $result['contributor_password_ok'] = $contributor ? password_verify('password123', $contributor['password_hash']) : false;

    $result['status'] = ($result['admin_password_ok'] && $result['contributor_password_ok']) ? 'all_fixed' : 'partial';
    $result['message'] = 'Accounts ready. Login: admin/password123 (Administrator) or contributor/password123 (Contributor).';

} catch (Throwable $e) {
    $result['status'] = 'error';
    $result['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
