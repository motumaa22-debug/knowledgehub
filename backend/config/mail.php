<?php
/**
 * KnowledgeHub — Email & SMTP Configuration
 * Path: /backend/config/mail.php
 * 
 * Supports:
 *  - Native PHP mail()
 *  - Direct SMTP (Gmail, Outlook, Brevo, SendGrid, Mailgun, etc.)
 */

return [
    // Driver: 'smtp' or 'mail'
    'driver' => getenv('MAIL_DRIVER') ?: 'mail',

    // Sender details
    'from_email' => getenv('MAIL_FROM_ADDRESS') ?: 'no-reply@knowledgehub.org',
    'from_name'  => getenv('MAIL_FROM_NAME') ?: 'KnowledgeHub Library',

    // SMTP Configuration (if using driver => 'smtp')
    'smtp' => [
        'host'       => getenv('MAIL_HOST') ?: 'smtp.gmail.com',
        'port'       => (int)(getenv('MAIL_PORT') ?: 587),
        'encryption' => getenv('MAIL_ENCRYPTION') ?: 'tls', // 'tls' or 'ssl'
        'username'   => getenv('MAIL_USERNAME') ?: '',
        'password'   => getenv('MAIL_PASSWORD') ?: '', // App Password
        'timeout'    => 10,
    ],
];
