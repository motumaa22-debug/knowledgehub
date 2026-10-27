<?php
/**
 * KnowledgeHub — Email & SMTP Configuration
 * Path: /backend/config/mail.php
 * 
 * Supports:
 *  - Direct SMTP (Gmail, Outlook, Brevo, SendGrid, Mailgun, etc.)
 *  - Native PHP mail() with strict fallback
 */

$mailUser = getenv('MAIL_USER') ?: getenv('MAIL_USERNAME') ?: '';
$mailPass = getenv('MAIL_PASS') ?: getenv('MAIL_PASSWORD') ?: '';
$mailHost = getenv('MAIL_HOST') ?: 'smtp.gmail.com';
$mailPort = (int)(getenv('MAIL_PORT') ?: 587);
$mailFrom = getenv('MAIL_FROM') ?: getenv('MAIL_FROM_ADDRESS') ?: ($mailUser ?: 'no-reply@knowledgehub.org');
$mailName = getenv('MAIL_FROM_NAME') ?: 'KnowledgeHub Library';

// Auto-select SMTP driver if credentials or host are provided
$driver = getenv('MAIL_DRIVER') ?: (!empty($mailUser) || !empty(getenv('MAIL_HOST')) ? 'smtp' : 'mail');

return [
    'driver'     => $driver,
    'from_email' => $mailFrom,
    'from_name'  => $mailName,
    'smtp'       => [
        'host'       => $mailHost,
        'port'       => $mailPort,
        'encryption' => getenv('MAIL_ENCRYPTION') ?: 'tls',
        'username'   => $mailUser,
        'password'   => $mailPass,
        'timeout'    => 4, // 4s timeout prevents blocking web requests
    ],
];
