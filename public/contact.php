<?php
// contact.php - receives JSON from the contact form and relays via email using Namecheap Private Email SMTP.
// Fill in the SMTP credentials below. If PHPMailer is not installed, a basic mail() fallback is used.

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$isSubscribeRequest = ($input['mode'] ?? '') === 'subscribe';

if ($isSubscribeRequest) {
    if (empty($input['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing email']);
        exit;
    }
} else {
    $required = ['name', 'email', 'description'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing $field"]);
            exit;
        }
    }
}

$fromAddress = 'hello@andreadeajones.com';
$fromName    = 'Andrea Dea Jones Site';
$toAddress   = 'hello@andreadeajones.com';
$smtpUser    = getenv('SMTP_USER');
$smtpPass    = getenv('SMTP_PASS');
$smtpHost    = getenv('SMTP_HOST');
$smtpPort    = (int) getenv('SMTP_PORT');
$smtpSecure  = 'ssl';

$email = trim((string) ($input['email'] ?? ''));
$fullName = trim(($input['name'] ?? '') . ' ' . ($input['surname'] ?? ''));

if ($isSubscribeRequest) {
    $subject = "Subscibe Request: {$email}";
    $body = "You have received a subscription request from : {$email}";
} else {
    $subject = 'New contact form submission';
    $body = "Name: {$fullName}\n"
          . "Email: {$email}\n"
          . "Phone: " . ($input['phone'] ?? '') . "\n"
          . "Location: " . ($input['location'] ?? '') . "\n"
          . "Type: " . ($input['type'] ?? '') . "\n"
          . "Description:\n" . ($input['description'] ?? '') . "\n";
}

$sent = false;
$error = null;

// Try PHPMailer using a manually extracted copy in public/PHPMailer.
$phpMailerBase = __DIR__ . '/PHPMailer/src';
if (is_dir($phpMailerBase)) {
    require_once $phpMailerBase . '/Exception.php';
    require_once $phpMailerBase . '/PHPMailer.php';
    require_once $phpMailerBase . '/SMTP.php';

    try {
        $mailer = new PHPMailer\PHPMailer\PHPMailer(true);
        $mailer->SMTPDebug = 2;
        $mailer->Debugoutput = 'error_log';
        $mailer->isSMTP();
        $mailer->Host = $smtpHost;
        $mailer->SMTPAuth = true;
        $mailer->SMTPAuthType = 'LOGIN';
        $mailer->Username = $smtpUser;
        $mailer->Password = $smtpPass;
        $mailer->SMTPSecure = $smtpSecure === 'ssl'
            ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mailer->Port = $smtpPort;
        $mailer->SMTPAutoTLS = false;

        $mailer->setFrom($fromAddress, $fromName);
        $mailer->addAddress($toAddress);
        $mailer->addReplyTo($email, $fullName ?: $email);
        $mailer->CharSet = 'UTF-8';
        $mailer->Subject = $subject;
        $mailer->Body = $body;

        $mailer->send();
        $sent = true;
    } catch (Throwable $e) {
        $error = $e->getMessage();
    }
}

// Fallback to PHP mail() if PHPMailer is unavailable.
if (!$sent) {
    $headers = [];
    $headers[] = 'From: ' . $fromAddress;
    $headers[] = 'Reply-To: ' . $email;
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $sent = mail($toAddress, $subject, $body, implode("\r\n", $headers));
    if (!$sent && !$error) {
        $error = 'mail() failed';
    }
}

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Mail failed', 'detail' => $error]);
}

