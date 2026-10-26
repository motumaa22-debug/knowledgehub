<?php
/**
 * KnowledgeHub — Real Mobile SMS Gateway Configuration
 * Path: /backend/config/sms.php
 * 
 * Supports real SMS dispatch to Ethiopian (Ethio Telecom / Safaricom)
 * and international mobile phone numbers.
 * 
 * Supported Providers:
 *  - 'afromessage'    : AfroMessage (Leading Ethiopian SMS API: Ethio Telecom & Safaricom)
 *  - 'twilio'         : Twilio Global SMS
 *  - 'africastalking' : Africa's Talking SMS
 *  - 'android_gateway': Android SMS Gateway (Send free real SMS using your Android phone SIM)
 *  - 'custom_webhook' : Any HTTP SMS Gateway endpoint
 */

return [
    // Active Provider: 'afromessage' | 'twilio' | 'africastalking' | 'android_gateway' | 'system'
    'default_provider' => getenv('SMS_PROVIDER') ?: 'afromessage',

    // 1. AfroMessage (Ethiopian EthioTelecom & Safaricom Gateway)
    // Register & get token at: https://afromessage.com
    'afromessage' => [
        'api_url'     => 'https://api.afromessage.com/api/send',
        'api_token'   => getenv('AFROMESSAGE_API_TOKEN') ?: '',
        'sender_name' => getenv('AFROMESSAGE_SENDER') ?: 'KnowledgeHub',
    ],

    // 2. Twilio (International SMS)
    'twilio' => [
        'account_sid'  => getenv('TWILIO_ACCOUNT_SID') ?: '',
        'auth_token'   => getenv('TWILIO_AUTH_TOKEN') ?: '',
        'from_number'  => getenv('TWILIO_PHONE_NUMBER') ?: '',
    ],

    // 3. Africa's Talking
    'africastalking' => [
        'username' => getenv('AT_USERNAME') ?: 'sandbox',
        'api_key'  => getenv('AT_API_KEY') ?: '',
        'from'     => getenv('AT_SENDER_ID') ?: '',
    ],

    // 4. Android SMS Gateway (Free real SMS using your own phone SIM card!)
    // e.g. using Android SMS Gateway app or Termux: http://192.168.1.X:8080/send
    'android_gateway' => [
        'gateway_url' => getenv('ANDROID_SMS_GATEWAY_URL') ?: '',
        'api_key'     => getenv('ANDROID_SMS_API_KEY') ?: '',
    ],
];
