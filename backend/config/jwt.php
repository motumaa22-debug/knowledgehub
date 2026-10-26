<?php
/**
 * KnowledgeHub — Token-based Authentication Helper
 * Generates and validates signed authentication tokens (HMAC-SHA256).
 */

require_once __DIR__ . '/database.php';

const SECRET_KEY = 'knowledgehub_secure_key_change_in_production_2026';

function generateToken(array $user): string {
    $payload = [
        'id'       => (int)$user['id'],
        'username' => $user['username'],
        'email'    => $user['email'] ?? '',
        'role'     => $user['role'] ?? 'user',
        'iat'      => time(),
        'exp'      => time() + (86400 * 7), // 7 days expiration
    ];

    $base64Payload = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', $base64Payload, SECRET_KEY);

    return $base64Payload . '.' . $signature;
}

function verifyToken(?string $token): ?array {
    if (!$token) {
        return null;
    }

    $parts = explode('.', $token);
    if (count($parts) !== 2) {
        return null;
    }

    [$base64Payload, $signature] = $parts;
    $expectedSignature = hash_hmac('sha256', $base64Payload, SECRET_KEY);

    if (!hash_equals($expectedSignature, $signature)) {
        return null; // Signature invalid
    }

    $payload = json_decode(base64_decode($base64Payload), true);
    if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
        return null; // Token expired or invalid JSON
    }

    return $payload;
}

function getAuthUser(): ?array {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
        return verifyToken($matches[1]);
    }

    return null;
}
