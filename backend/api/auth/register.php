<?php
/**
 * KnowledgeHub API — User Registration Endpoint with Email OTP Verification
 * Path: /api/auth/register.php
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

$username    = trim($input['username'] ?? '');
$email       = trim($input['email'] ?? '');
$rawPhone    = trim($input['phone_number'] ?? $input['phone'] ?? '');
$password    = $input['password'] ?? '';

// Validation
if (empty($username) || empty($email) || empty($password)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Username, email address, and password are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Please provide a valid email address.']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters.']);
    exit;
}

$normalizedPhone = !empty($rawPhone) ? SmsService::normalizePhoneNumber($rawPhone) : null;

try {
    $pdo = getDB();

    // Check if username, email, or phone number already exists
    $checkStmt = $pdo->prepare('
        SELECT id, username, email, phone_number, is_verified 
        FROM users 
        WHERE username = ? 
           OR email = ? 
           OR (phone_number IS NOT NULL AND phone_number = ?)
        ORDER BY id DESC 
        LIMIT 1
    ');
    $checkStmt->execute([$username, $email, $normalizedPhone ?: 'NONE']);
    $existing = $checkStmt->fetch();

    // Generate random 4-digit verification code
    $verificationCode = str_pad((string)random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
    $expiresAt = date('Y-m-d H:i:s', time() + (15 * 60)); // 15 minutes validity
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    if ($existing) {
        if ((int)$existing['is_verified'] === 1) {
            http_response_code(409);
            echo json_encode([
                'status'  => 'error',
                'message' => 'An active account with this username or email already exists. Please sign in.'
            ]);
            exit;
        }

        // If unverified prior registration, update existing record with fresh OTP
        try {
            $updateStmt = $pdo->prepare('
                UPDATE users 
                SET username = ?, email = ?, password_hash = ?, verification_code = ?, code_expires_at = ?, verification_expires_at = ?
                WHERE id = ?
            ');
            $updateStmt->execute([$username, $email, $passwordHash, $verificationCode, $expiresAt, $expiresAt, $existing['id']]);
        } catch (Throwable $e) {
            $updateStmt = $pdo->prepare('
                UPDATE users 
                SET username = ?, email = ?, password_hash = ?, verification_code = ?
                WHERE id = ?
            ');
            $updateStmt->execute([$username, $email, $passwordHash, $verificationCode, $existing['id']]);
        }
        $userId = (int)$existing['id'];
    } else {
        // Insert new user
        try {
            $insertStmt = $pdo->prepare('
                INSERT INTO users (username, email, password_hash, role, is_verified, verification_code, code_expires_at, verification_expires_at) 
                VALUES (?, ?, ?, "user", 0, ?, ?, ?)
            ');
            $insertStmt->execute([$username, $email, $passwordHash, $verificationCode, $expiresAt, $expiresAt]);
        } catch (Throwable $e) {
            $insertStmt = $pdo->prepare('
                INSERT INTO users (username, email, password_hash, role, is_verified, verification_code) 
                VALUES (?, ?, ?, "user", 0, ?)
            ');
            $insertStmt->execute([$username, $email, $passwordHash, $verificationCode]);
        }
        $userId = (int)$pdo->lastInsertId();
    }

    // 1. Primary: Dispatch 4-digit OTP directly to user's real email inbox
    EmailService::sendOtpEmail($email, $verificationCode, $username);

    // 2. Optional: If user provided a phone number, also dispatch SMS
    if (!empty($normalizedPhone)) {
        @SmsService::sendOtp($normalizedPhone, $verificationCode, $username);
    }

    http_response_code(201);
    echo json_encode([
        'status'       => 'pending_verification',
        'message'      => 'Account created! A 4-digit verification code has been dispatched directly to your email inbox.',
        'user_id'      => $userId,
        'username'     => $username,
        'email'        => $email,
        'phone_number' => $rawPhone
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $e->getMessage()]);
}
