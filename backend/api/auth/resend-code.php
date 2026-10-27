<?php
/**
 * KnowledgeHub API — Resend Email 4-Digit Verification Code Endpoint
 * Path: /api/auth/resend-code.php
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
$identifier = trim($input['email'] ?? $input['phone'] ?? $input['phone_number'] ?? $input['identifier'] ?? '');

if (empty($identifier)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Email address or phone number is required to resend code.']);
    exit;
}

try {
    $pdo = getDB();
    $cleanPhone = preg_replace('/[^\d+]/', '', $identifier);

    $stmt = $pdo->prepare('
        SELECT id, username, email, phone_number, is_verified 
        FROM users 
        WHERE email = ? 
           OR phone_number = ? 
           OR (phone_number IS NOT NULL AND phone_number LIKE ?) 
        ORDER BY id DESC
        LIMIT 1
    ');
    $stmt->execute([$identifier, $cleanPhone, '%' . substr($cleanPhone, -9)]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Account not found with this email or phone number.']);
        exit;
    }

    if ((int)$user['is_verified'] === 1) {
        echo json_encode([
            'status'  => 'already_verified',
            'message' => 'This account is already verified. You can log in directly.'
        ]);
        exit;
    }

    // Generate random 4-digit number
    $newCode = str_pad((string)random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
    $expiresAt = date('Y-m-d H:i:s', time() + (15 * 60)); // 15 mins

    try {
        $updateStmt = $pdo->prepare('UPDATE users SET verification_code = ?, code_expires_at = ?, verification_expires_at = ? WHERE id = ?');
        $updateStmt->execute([$newCode, $expiresAt, $expiresAt, $user['id']]);
    } catch (Throwable $e) {
        $updateStmt = $pdo->prepare('UPDATE users SET verification_code = ? WHERE id = ?');
        $updateStmt->execute([$newCode, $user['id']]);
    }

    // 1. Primary: Dispatch Email OTP to inbox
    EmailService::sendOtpEmail($user['email'], $newCode, $user['username']);

    // 2. Optional: If user has a phone number, also dispatch SMS
    if (!empty($user['phone_number'])) {
        @SmsService::sendOtp($user['phone_number'], $newCode, $user['username']);
    }

    echo json_encode([
        'status'       => 'success',
        'message'      => 'A new 4-digit verification code has been dispatched directly to your email inbox.',
        'email'        => $user['email'],
        'phone_number' => $user['phone_number']
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to resend code: ' . $e->getMessage()]);
}
