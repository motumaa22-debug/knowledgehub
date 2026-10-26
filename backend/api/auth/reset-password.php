<?php
/**
 * KnowledgeHub API — Reset Password (Verify 4-Digit Code & Update Password)
 * Path: /api/auth/reset-password.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';
require_once __DIR__ . '/../../services/emailService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed. Use POST.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$identifier      = trim($input['email'] ?? $input['username'] ?? $input['identifier'] ?? '');
$code            = trim($input['code'] ?? '');
$password        = $input['password'] ?? '';
$confirmPassword = $input['confirm_password'] ?? $input['confirmPassword'] ?? '';

// Validations
if (empty($identifier) || empty($code) || empty($password)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Email, 4-digit reset code, and new password are required.']);
    exit;
}

if (!preg_match('/^\d{4}$/', $code)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Verification code must be exactly 4 digits.']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'New password must be at least 6 characters long.']);
    exit;
}

if (!empty($confirmPassword) && $password !== $confirmPassword) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Passwords do not match.']);
    exit;
}

try {
    $pdo = getDB();

    $stmt = $pdo->prepare('
        SELECT id, username, email, phone_number, role, is_verified, reset_code, reset_expires_at 
        FROM users 
        WHERE email = ? OR username = ? 
        LIMIT 1
    ');
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Account not found with this email or username.']);
        exit;
    }

    if (empty($user['reset_code'])) {
        http_response_code(422);
        echo json_encode([
            'status'  => 'error',
            'message' => 'No active password reset request was found. Please request a new 4-digit code.'
        ]);
        exit;
    }

    if ($user['reset_code'] !== $code) {
        http_response_code(422);
        echo json_encode([
            'status'  => 'error',
            'message' => 'Incorrect 4-digit reset code. Please check your email inbox and try again.'
        ]);
        exit;
    }

    if ($user['reset_expires_at'] && strtotime($user['reset_expires_at']) < time()) {
        http_response_code(422);
        echo json_encode([
            'status'  => 'error',
            'message' => 'This 4-digit reset code has expired. Please request a fresh reset code.'
        ]);
        exit;
    }

    // Hash new password and clear reset token
    $newPasswordHash = password_hash($password, PASSWORD_BCRYPT);
    $updateStmt = $pdo->prepare('
        UPDATE users 
        SET password_hash = ?, reset_code = NULL, reset_expires_at = NULL, is_verified = 1 
        WHERE id = ?
    ');
    $updateStmt->execute([$newPasswordHash, $user['id']]);

    // Send confirmation email
    @EmailService::sendPasswordResetSuccessEmail($user['email'], $user['username']);

    $userData = [
        'id'           => (int)$user['id'],
        'username'     => $user['username'],
        'email'        => $user['email'],
        'phone_number' => $user['phone_number'] ?? null,
        'role'         => $user['role']
    ];
    $token = generateToken($userData);

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Password reset successfully! You can now log in with your new password.',
        'token'   => $token,
        'user'    => $userData
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to reset password: ' . $e->getMessage()]);
}
