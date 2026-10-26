<?php
/**
 * KnowledgeHub API — Phone / Email 4-Digit Code Verification Endpoint
 * Path: /api/auth/verify-code.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed. Use POST.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$identifier  = trim($input['phone'] ?? $input['phone_number'] ?? $input['email'] ?? $input['identifier'] ?? '');
$code        = trim($input['code'] ?? '');

if (empty($identifier) || empty($code)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Phone number or email and 4-digit code are required.']);
    exit;
}

if (!preg_match('/^\d{4}$/', $code)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Verification code must be exactly 4 digits.']);
    exit;
}

try {
    $pdo = getDB();

    require_once __DIR__ . '/../../services/smsService.php';
    $cleanPhone = preg_replace('/[^\d+]/', '', $identifier);
    $normalizedPhone = SmsService::normalizePhoneNumber($identifier);
    $last9 = substr($cleanPhone, -9);

    $stmt = $pdo->prepare('
        SELECT id, username, email, phone_number, role, is_verified, verification_code, code_expires_at 
        FROM users 
        WHERE email = ? 
           OR phone_number = ? 
           OR phone_number = ? 
           OR phone_number LIKE ? 
        ORDER BY id DESC 
        LIMIT 1
    ');
    $stmt->execute([$identifier, $identifier, $normalizedPhone, '%' . $last9]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Account not found with this phone number or email.']);
        exit;
    }

    if ((int)$user['is_verified'] === 1) {
        $userData = [
            'id'           => (int)$user['id'],
            'username'     => $user['username'],
            'email'        => $user['email'],
            'phone_number' => $user['phone_number'],
            'role'         => $user['role']
        ];
        $token = generateToken($userData);

        echo json_encode([
            'status'  => 'success',
            'message' => 'Account is already verified on this phone.',
            'token'   => $token,
            'user'    => $userData
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Check code match
    if ($user['verification_code'] !== $code) {
        http_response_code(422);
        echo json_encode([
            'status'  => 'error',
            'message' => 'Incorrect 4-digit verification code. Please check your phone SMS and try again.'
        ]);
        exit;
    }

    // Check expiration
    if ($user['code_expires_at'] && strtotime($user['code_expires_at']) < time()) {
        http_response_code(422);
        echo json_encode([
            'status'  => 'error',
            'message' => 'This 4-digit code has expired. Please click "Resend Code" to receive a new one.'
        ]);
        exit;
    }

    // Mark as verified
    $updateStmt = $pdo->prepare('UPDATE users SET is_verified = 1, verification_code = NULL, code_expires_at = NULL WHERE id = ?');
    $updateStmt->execute([$user['id']]);

    $userData = [
        'id'           => (int)$user['id'],
        'username'     => $user['username'],
        'email'        => $user['email'],
        'phone_number' => $user['phone_number'],
        'role'         => $user['role']
    ];
    $token = generateToken($userData);

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Account verified successfully! Welcome to KnowledgeHub.',
        'token'   => $token,
        'user'    => $userData
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Verification failed: ' . $e->getMessage()]);
}
