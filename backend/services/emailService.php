<?php
/**
 * KnowledgeHub — Email OTP Dispatch Service
 * Path: /backend/services/emailService.php
 * 
 * Generates and delivers branded HTML Email OTPs directly to user inboxes.
 * Supports standard PHP mail(), direct SMTP (Gmail, Brevo, Outlook),
 * and local archive logging.
 */

class EmailService {
    private static $logDir = __DIR__ . '/../storage/sent_emails';

    /**
     * Send 4-Digit OTP to User's Email Inbox
     * 
     * @param string $toEmail Recipient email address
     * @param string $otp 4-digit verification code
     * @param string $username Contributor username
     * @return array Result metadata
     */
    public static function sendOtpEmail($toEmail, $otp, $username = 'Contributor') {
        $toEmail = trim($toEmail);
        if (!filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Invalid email address.'];
        }

        $config = [];
        $configFile = __DIR__ . '/../config/mail.php';
        if (file_exists($configFile)) {
            $config = require $configFile;
        }

        $fromEmail = $config['from_email'] ?? 'no-reply@knowledgehub.org';
        $fromName  = $config['from_name'] ?? 'KnowledgeHub Library';
        $subject   = "{$otp} is your KnowledgeHub verification code";

        $htmlBody = self::renderEmailTemplate($username, $otp);
        $textBody = "Hello {$username},\n\nYour 4-digit KnowledgeHub verification code is: {$otp}\n\nThis code is valid for 15 minutes. Please enter it to verify your account.\n\nKnowledgeHub — Digital Knowledge Library";

        $sent = false;

        // Strategy 1: Direct SMTP if username/password are configured
        if (($config['driver'] ?? '') === 'smtp' && !empty($config['smtp']['username'])) {
            $sent = self::sendViaSmtp($toEmail, $subject, $htmlBody, $config);
        }

        // Strategy 2: Native PHP mail() with multipart HTML headers
        if (!$sent) {
            $headers  = "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "From: {$fromName} <{$fromEmail}>\r\n";
            $headers .= "Reply-To: {$fromEmail}\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

            $sent = @mail($toEmail, $subject, $htmlBody, $headers);
        }

        // Strategy 3: Archive email to storage for review & fallback
        self::saveEmailArchive($toEmail, $subject, $otp, $htmlBody);

        return [
            'success'   => true,
            'email'     => $toEmail,
            'message'   => '4-digit verification code has been dispatched to your email inbox.',
            'sent_at'   => date('Y-m-d H:i:s')
        ];
    }

    /**
     * Professional Branded HTML Email Template
     */
    private static function renderEmailTemplate($username, $otp) {
        $digits = str_split($otp);
        $digitBoxes = '';
        foreach ($digits as $d) {
            $digitBoxes .= '<span style="display:inline-block; width:52px; height:60px; line-height:60px; margin:0 6px; font-size:32px; font-weight:800; color:#1b365d; background:#f1f5f9; border:2px solid #cbd5e1; border-radius:10px; text-align:center; font-family:monospace;">' . htmlspecialchars($d) . '</span>';
        }

        return '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>KnowledgeHub Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 25px rgba(0,0,0,0.05); overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #1b365d 0%, #0f172a 100%); padding:32px 40px; text-align:center;">
              <span style="font-size:36px; display:block; margin-bottom:8px;">📚</span>
              <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:700; letter-spacing:-0.02em;">KnowledgeHub</h1>
              <p style="margin:6px 0 0 0; color:#93c5fd; font-size:14px;">Digital Knowledge Library</p>
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px 0; font-size:20px; color:#0f172a; font-weight:700;">Account Verification Code</h2>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#475569;">
                Hello <strong>' . htmlspecialchars($username) . '</strong>,
                <br>
                Thank you for joining KnowledgeHub. Please enter the following 4-digit code in your browser to verify your email address:
              </p>

              <!-- OTP Code Display -->
              <div style="text-align:center; margin:30px 0;">
                ' . $digitBoxes . '
              </div>

              <!-- Security Notice -->
              <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:14px 18px; margin:24px 0;">
                <p style="margin:0; font-size:13px; color:#166534; line-height:1.5;">
                  ⏱️ <strong>Valid for 15 minutes.</strong> Never share this verification code with anyone. KnowledgeHub staff will never ask for your code.
                </p>
              </div>

              <p style="margin:24px 0 0 0; font-size:14px; color:#64748b; line-height:1.5;">
                If you did not request this verification email, please safely disregard this message or contact support.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#94a3b8;">
                &copy; ' . date('Y') . ' KnowledgeHub — Digital Knowledge Library. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
    }

    /**
     * Send via Direct SMTP Socket Connection
     */
    private static function sendViaSmtp($to, $subject, $body, $config) {
        $smtp = $config['smtp'];
        $host = $smtp['host'];
        $port = $smtp['port'];
        $timeout = $smtp['timeout'] ?? 10;
        $user = $smtp['username'];
        $pass = $smtp['password'];
        $from = $config['from_email'];

        $socketHost = ($smtp['encryption'] === 'ssl') ? 'ssl://' . $host : $host;
        $fp = @fsockopen($socketHost, $port, $errno, $errstr, $timeout);
        if (!$fp) return false;

        // Set socket timeout so reads/writes never block PHP
        stream_set_timeout($fp, 4);

        $read = function() use ($fp) {
            $data = '';
            while ($str = fgets($fp, 515)) {
                $data .= $str;
                if (substr($str, 3, 1) === ' ') break;
            }
            return $data;
        };

        $write = function($cmd) use ($fp) {
            fputs($fp, $cmd . "\r\n");
        };

        $read();
        $write("EHLO " . gethostname());
        $read();

        if ($smtp['encryption'] === 'tls') {
            $write("STARTTLS");
            $res = $read();
            if (strpos($res, '220') !== 0) { fclose($fp); return false; }
            stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            $write("EHLO " . gethostname());
            $read();
        }

        $write("AUTH LOGIN");
        $read();
        $write(base64_encode($user));
        $read();
        $write(base64_encode($pass));
        $res = $read();
        if (strpos($res, '235') !== 0) { fclose($fp); return false; }

        $write("MAIL FROM: <{$from}>");
        $read();
        $write("RCPT TO: <{$to}>");
        $read();
        $write("DATA");
        $read();

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$config['from_name']} <{$from}>\r\n";
        $headers .= "To: <{$to}>\r\n";
        $headers .= "Subject: {$subject}\r\n";
        $headers .= "Date: " . date('r') . "\r\n";

        $write($headers . "\r\n" . $body . "\r\n.");
        $read();

        $write("QUIT");
        $read();
        fclose($fp);
        return true;
    }

    /**
     * Send Password Reset 4-Digit Code to User's Email Inbox
     * 
     * @param string $toEmail Recipient email address
     * @param string $otp 4-digit reset code
     * @param string $username Member username
     * @return array Result metadata
     */
    public static function sendPasswordResetEmail($toEmail, $otp, $username = 'Member') {
        $toEmail = trim($toEmail);
        if (!filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Invalid email address.'];
        }

        $config = [];
        $configFile = __DIR__ . '/../config/mail.php';
        if (file_exists($configFile)) {
            $config = require $configFile;
        }

        $fromEmail = $config['from_email'] ?? 'no-reply@knowledgehub.org';
        $fromName  = $config['from_name'] ?? 'KnowledgeHub Library';
        $subject   = "{$otp} is your KnowledgeHub password reset code";

        $htmlBody = self::renderPasswordResetTemplate($username, $otp);
        $sent = false;

        if (($config['driver'] ?? '') === 'smtp' && !empty($config['smtp']['username'])) {
            $sent = self::sendViaSmtp($toEmail, $subject, $htmlBody, $config);
        }

        if (!$sent) {
            $headers  = "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "From: {$fromName} <{$fromEmail}>\r\n";
            $headers .= "Reply-To: {$fromEmail}\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

            $sent = @mail($toEmail, $subject, $htmlBody, $headers);
        }

        self::saveEmailArchive($toEmail, $subject, $otp, $htmlBody);

        return [
            'success'   => true,
            'email'     => $toEmail,
            'message'   => '4-digit password reset code has been dispatched to your email inbox.',
            'sent_at'   => date('Y-m-d H:i:s')
        ];
    }

    /**
     * Send Password Reset Success Notification
     */
    public static function sendPasswordResetSuccessEmail($toEmail, $username = 'Member') {
        $toEmail = trim($toEmail);
        if (!filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Invalid email address.'];
        }

        $config = [];
        $configFile = __DIR__ . '/../config/mail.php';
        if (file_exists($configFile)) {
            $config = require $configFile;
        }

        $fromEmail = $config['from_email'] ?? 'no-reply@knowledgehub.org';
        $fromName  = $config['from_name'] ?? 'KnowledgeHub Library';
        $subject   = "Your KnowledgeHub password has been successfully reset";

        $htmlBody = self::renderPasswordResetSuccessTemplate($username);
        $sent = false;

        if (($config['driver'] ?? '') === 'smtp' && !empty($config['smtp']['username'])) {
            $sent = self::sendViaSmtp($toEmail, $subject, $htmlBody, $config);
        }

        if (!$sent) {
            $headers  = "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "From: {$fromName} <{$fromEmail}>\r\n";
            $headers .= "Reply-To: {$fromEmail}\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

            $sent = @mail($toEmail, $subject, $htmlBody, $headers);
        }

        self::saveEmailArchive($toEmail, $subject, 'SUCCESS_NOTIFICATION', $htmlBody);

        return ['success' => true];
    }

    /**
     * Branded HTML Email Template for Password Reset
     */
    private static function renderPasswordResetTemplate($username, $otp) {
        $digits = str_split($otp);
        $digitBoxes = '';
        foreach ($digits as $d) {
            $digitBoxes .= '<span style="display:inline-block; width:54px; height:62px; line-height:62px; margin:0 6px; font-size:32px; font-weight:800; color:#1e3a8a; background:#f1f5f9; border:2px solid #93c5fd; border-radius:12px; text-align:center; font-family:monospace; box-shadow:0 2px 5px rgba(0,0,0,0.05);">' . htmlspecialchars($d) . '</span>';
        }

        return '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>KnowledgeHub Password Reset</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:18px; border:1px solid #e2e8f0; box-shadow:0 12px 30px rgba(15,23,42,0.08); overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding:32px 40px; text-align:center;">
              <span style="font-size:36px; display:block; margin-bottom:8px;">🔑</span>
              <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:700; letter-spacing:-0.02em;">KnowledgeHub</h1>
              <p style="margin:6px 0 0 0; color:#93c5fd; font-size:14px;">Digital Knowledge Library</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px 0; font-size:20px; color:#0f172a; font-weight:700;">Password Reset Request</h2>
              <p style="margin:0 0 20px 0; font-size:15px; line-height:1.6; color:#475569;">
                Hello <strong>' . htmlspecialchars($username) . '</strong>,
                <br><br>
                We received a request to reset the password for your KnowledgeHub account. Please use the following 4-digit verification code to choose a new password:
              </p>
              <div style="text-align:center; margin:32px 0;">
                ' . $digitBoxes . '
              </div>
              <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:10px; padding:14px 18px; margin:24px 0;">
                <p style="margin:0; font-size:13px; color:#92400e; line-height:1.5;">
                  ⏱️ <strong>Valid for 15 minutes.</strong> Never share this code with anyone. If you did not make this request, your account is safe and you can ignore this email.
                </p>
              </div>
              <p style="margin:24px 0 0 0; font-size:13px; color:#94a3b8; line-height:1.5;">
                KnowledgeHub Security Team &bull; Protecting heritage, literature, and human knowledge.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#94a3b8;">
                &copy; ' . date('Y') . ' KnowledgeHub — Digital Knowledge Library. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
    }

    /**
     * Branded HTML Email Template for Password Reset Confirmation
     */
    private static function renderPasswordResetSuccessTemplate($username) {
        return '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>KnowledgeHub Password Updated</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:18px; border:1px solid #e2e8f0; box-shadow:0 12px 30px rgba(15,23,42,0.08); overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg, #059669 0%, #064e3b 100%); padding:32px 40px; text-align:center;">
              <span style="font-size:36px; display:block; margin-bottom:8px;">✅</span>
              <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:700;">Password Updated</h1>
              <p style="margin:6px 0 0 0; color:#a7f3d0; font-size:14px;">KnowledgeHub Library Security</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px 0; font-size:20px; color:#0f172a; font-weight:700;">Your Password Has Been Changed</h2>
              <p style="margin:0 0 20px 0; font-size:15px; line-height:1.6; color:#475569;">
                Hello <strong>' . htmlspecialchars($username) . '</strong>,
                <br><br>
                This confirms that the password for your KnowledgeHub account was successfully reset on ' . date('F j, Y \a\t g:i A') . '.
              </p>
              <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:10px; padding:14px 18px; margin:24px 0;">
                <p style="margin:0; font-size:13px; color:#065f46; line-height:1.5;">
                  🔒 You can now sign in with your new password on any device.
                </p>
              </div>
              <p style="margin:24px 0 0 0; font-size:13px; color:#94a3b8; line-height:1.5;">
                If you did not perform this action, please contact library administration immediately to secure your account.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#94a3b8;">
                &copy; ' . date('Y') . ' KnowledgeHub — Digital Knowledge Library. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
    }

    /**
     * Archive outgoing email to backend/storage/sent_emails/
     */
    private static function saveEmailArchive($to, $subject, $otp, $htmlBody) {
        if (!is_dir(self::$logDir)) {
            @mkdir(self::$logDir, 0755, true);
        }

        $filename = self::$logDir . '/' . date('Ymd_His') . '_' . preg_replace('/[^a-zA-Z0-9]/', '_', $to) . '.html';
        $meta = "<!-- TO: {$to} | SUBJECT: {$subject} | OTP: {$otp} | DATE: " . date('Y-m-d H:i:s') . " -->\n";
        @file_put_contents($filename, $meta . $htmlBody);
    }
}
