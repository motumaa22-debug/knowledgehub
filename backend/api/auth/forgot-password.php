<?php
/**
 * KnowledgeHub API — Forgot Password (Request 4-Digit Reset Code)
 * Path: /api/auth/forgot-password.php
 * 
 * Generates a secure 4-digit reset OTP and delivers it directly to the user's email inbox.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../services/emailService.php';
require_once __DIR__ . '/../../services/smsService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed. Use POST.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$identifier = trim($input['email'] ?? $input['username'] ?? $input['identifier'] ?? '');

if (empty($identifier)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please provide your registered email address or username.']);
    exit;
}

try {
    $pdo = getDB();

    // Auto-ensure reset_code and reset_expires_at columns exist
    try {
        $pdo->query("SELECT reset_code FROM users LIMIT 1");
    } catch (PDOException $e) {
        $pdo->exec("ALTER TABLE users ADD COLUMN reset_code VARCHAR(10) NULL, ADD COLUMN reset_expires_at DATETIME NULL");
    }

    $cleanPhone = preg_replace('/[^\d+]/', '', $identifier);

    $stmt = $pdo->prepare('
        SELECT id, username, email, phone_number, is_verified 
        FROM users 
        WHERE email = ? 
           OR username = ? 
           OR (phone_number IS NOT NULL AND phone_number = ?)
        LIMIT 1
    ');
    $stmt->execute([$identifier, $identifier, $cleanPhone ?: 'NONE']);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            'status'  => 'error',
            'message' => 'No account found with this email address or username. Please check your spelling or register.'
        ]);
        exit;
    }

    // Generate random 4-digit code
    $resetCode = str_pad((string)random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
    $expiresAt = date('Y-m-d H:i:s', time() + (15 * 60)); // 15 minutes validity

    $updateStmt = $pdo->prepare('UPDATE users SET reset_code = ?, reset_expires_at = ? WHERE id = ?');
    $updateStmt->execute([$resetCode, $expiresAt, $user['id']]);

    // Dispatch 4-digit OTP directly to email inbox
    EmailService::sendPasswordResetEmail($user['email'], $resetCode, $user['username']);

    // Optional: Also dispatch SMS if mobile phone number exists
    if (!empty($user['phone_number'])) {
        @SmsService::sendOtp($user['phone_number'], $resetCode, $user['username']);
    }

    echo json_encode([
        'status'       => 'success',
        'message'      => 'A 4-digit password reset code has been dispatched to your email inbox.',
        'email'        => $user['email'],
        'username'     => $user['username'],
        'phone_number' => $user['phone_number'] ?? null
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Password reset request failed: ' . $e->getMessage()]);
}
