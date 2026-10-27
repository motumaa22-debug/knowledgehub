<?php
/**
 * KnowledgeHub API — User Login Endpoint with Verification Enforcement
 * Path: /api/auth/login.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/jwt.php';
require_once __DIR__ . '/../../services/emailService.php';
require_once __DIR__ . '/../../services/smsService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed. Use POST.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$usernameOrEmail = trim($input['username'] ?? $input['email'] ?? '');
$password        = $input['password'] ?? '';

if (empty($usernameOrEmail) || empty($password)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please provide both username/email and password.']);
    exit;
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare('
        SELECT * 
        FROM users 
        WHERE username = ? OR email = ? 
        LIMIT 1
    ');
    $stmt->execute([$usernameOrEmail, $usernameOrEmail]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
        exit;
    }

    // Administrators are always pre-verified — log in immediately
    if ($user['role'] === 'admin') {
        $userData = [
            'id'       => (int)$user['id'],
            'username' => $user['username'],
            'email'    => $user['email'],
            'role'     => 'admin'
        ];

        $token = generateToken($userData);

        echo json_encode([
            'status'  => 'success',
            'message' => 'Logged in successfully as Administrator!',
            'token'   => $token,
            'user'    => $userData
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Check if user is verified (standard members only)
    if ($user['role'] !== 'admin' && (int)($user['is_verified'] ?? 1) === 0) {
        // Generate a new 4-digit code if expired or missing
        $code = $user['verification_code'] ?? null;
        $expiresAtVal = $user['code_expires_at'] ?? $user['verification_expires_at'] ?? null;

        if (!$code || ($expiresAtVal && strtotime($expiresAtVal) < time())) {
            $code = str_pad((string)random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
            $expiresAt = date('Y-m-d H:i:s', time() + (15 * 60));
            try {
                $update = $pdo->prepare('UPDATE users SET verification_code = ?, code_expires_at = ?, verification_expires_at = ? WHERE id = ?');
                $update->execute([$code, $expiresAt, $expiresAt, $user['id']]);
            } catch (Throwable $e) {
                try {
                    $update = $pdo->prepare('UPDATE users SET verification_code = ? WHERE id = ?');
                    $update->execute([$code, $user['id']]);
                } catch (Throwable $ignore) {}
            }

            // Dispatch Email OTP to inbox
            try {
                EmailService::sendOtpEmail($user['email'], $code, $user['username']);
            } catch (Throwable $e) {
                // Email failure should not hang auth
            }

            // Optional SMS if user has a phone number
            if (!empty($user['phone_number'])) {
                @SmsService::sendOtp($user['phone_number'], $code, $user['username']);
            }
        }

        http_response_code(200);
        echo json_encode([
            'status'       => 'unverified',
            'message'      => 'Your account is pending verification. Please enter the 4-digit code sent to your email inbox.',
            'email'        => $user['email'],
            'phone_number' => $user['phone_number'] ?? '',
            'username'     => $user['username']
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $userData = [
        'id'       => (int)$user['id'],
        'username' => $user['username'],
        'email'    => $user['email'],
        'role'     => $user['role']
    ];

    $token = generateToken($userData);

    echo json_encode([
        'status'  => 'success',
        'message' => 'Logged in successfully!',
        'token'   => $token,
        'user'    => $userData
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Login error: ' . $e->getMessage()]);
}
