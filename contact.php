<?php

/* ==============================
   Citabharat EV Contact Handler
   Email + Google Sheets
   ============================== */

const TO = 'sales@citabharatev.com';
const FROM = 'sales@citabharatev.com';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFTA5KHPbvgEGVJePsFSabFn8zd1f4K_2qZIPUHrJH7aiZv0qco2ysB0iXQROZmEx3/exec';

const LIMIT = 5;
const WINDOW = 3600;


/* Session / Security */
session_set_cookie_params([
    'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']),
    'samesite' => 'Strict'
]);

session_start();

header('Content-Type: application/json');
header('Cache-Control: no-store');


/* JSON response */
function out($ok, $message, $code = 200)
{
    http_response_code($code);

    echo json_encode([
        'ok' => $ok,
        'message' => $message
    ]);

    exit;
}


/* Clean input */
function clean($value, $max)
{
    $value = trim((string)$value);
    $value = preg_replace('/[\r\n]+/', ' ', $value);

    return mb_substr($value, 0, $max);
}


/* Only POST requests */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    out(false, 'Invalid request.', 405);
}


/* Honeypot */
if (!empty($_POST['website'])) {
    out(true, 'Thank you. We will contact you shortly.');
}


/* CSRF */
$token = $_POST['csrf'] ?? '';

if (
    empty($_SESSION['csrf']) ||
    !hash_equals($_SESSION['csrf'], $token)
) {
    out(
        false,
        'Session expired. Please reload the page and try again.',
        403
    );
}


/* Rate limit */
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x';

$file = sys_get_temp_dir() . '/cita_rl_' . md5($ip);

$now = time();

$hits = is_file($file)
    ? array_filter(
        array_map(
            'intval',
            explode(',', file_get_contents($file))
        ),
        fn($x) => $x > $now - WINDOW
    )
    : [];

if (count($hits) >= LIMIT) {
    out(
        false,
        'Too many requests. Please try again later or call +91 70204 04346.',
        429
    );
}

$hits[] = $now;

file_put_contents(
    $file,
    implode(',', $hits),
    LOCK_EX
);


/* Form data */
$name = clean($_POST['name'] ?? '', 80);
$phone = clean($_POST['phone'] ?? '', 15);
$email = clean($_POST['email'] ?? '', 120);

$city = clean($_POST['city'] ?? '', 80);
$interest = clean($_POST['interest'] ?? '', 60);
$model = clean($_POST['model'] ?? '', 120);

$company = clean($_POST['company'] ?? '', 100);
$size = clean($_POST['size'] ?? '', 40);
$budget = clean($_POST['budget'] ?? '', 40);
$timeline = clean($_POST['timeline'] ?? '', 40);
$power = clean($_POST['power'] ?? '', 40);

$msg = trim((string)($_POST['message'] ?? ''));
$msg = mb_substr($msg, 0, 2000);

$det = trim((string)($_POST['details'] ?? ''));
$det = mb_substr($det, 0, 1500);


/* Validation */
if (
    $name === '' ||
    !preg_match('/^[+0-9 ]{8,15}$/', $phone) ||
    !filter_var($email, FILTER_VALIDATE_EMAIL)
) {
    out(
        false,
        'Please check your name, phone and email.',
        422
    );
}


/* ==============================
   1. SEND EMAIL
   ============================== */

$body =
"New enquiry from citabharatev.com\n\n" .

"Name: $name\n" .
"Phone: $phone\n" .
"Email: $email\n" .
"Company: $company\n" .
"City: $city\n" .
"Interest: $interest\n" .
"Model: $model\n" .
"Site size: $size\n" .
"Budget: $budget\n" .
"Timeline: $timeline\n" .
"Power connection: $power\n\n" .

"Message:\n" .
"$msg\n\n" .

"Estimate details:\n" .
"$det\n\n" .

"IP: $ip\n";


$headers =
    "From: " . FROM . "\r\n" .
    "Reply-To: " . $email . "\r\n" .
    "Content-Type: text/plain; charset=UTF-8\r\n";


$sent = mail(
    TO,
    'Website enquiry: ' . $interest . ' - ' . $name,
    $body,
    $headers
);


/* Customer confirmation email */
if ($sent) {

    @mail(
        $email,
        'We received your enquiry - Citabharat EV',
        "Hello $name,\n\n" .
        "Thank you for contacting Citabharat EV.\n\n" .
        "Our team will call you shortly.\n\n" .
        "Call/WhatsApp: +91 70204 04346\n" .
        "sales@citabharatev.com\n\n" .
        "Regards,\n" .
        "Citabharat EV Team",
        $headers
    );
}


/* ==============================
   2. SEND TO GOOGLE SHEETS
   ============================== */

$sheetData = json_encode([
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'company' => $company,
    'city' => $city,
    'interest' => $interest,
    'model' => $model,
    'size' => $size,
    'budget' => $budget,
    'timeline' => $timeline,
    'power' => $power,
    'message' => $msg,
    'details' => $det,
    'ip' => $ip
]);


$ch = curl_init(GOOGLE_SCRIPT_URL);

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $sheetData,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($sheetData)
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_SSL_VERIFYPEER => true
]);

$sheetResponse = curl_exec($ch);

$curlError = curl_error($ch);

$httpCode = curl_getinfo(
    $ch,
    CURLINFO_HTTP_CODE
);

curl_close($ch);


/* Check Google Sheets response */
$sheetSaved = false;

if (
    !$curlError &&
    $httpCode >= 200 &&
    $httpCode < 400
) {

    $sheetResult = json_decode(
        $sheetResponse,
        true
    );

    if (!empty($sheetResult['ok'])) {
        $sheetSaved = true;
    }
}


/* ==============================
   FINAL RESPONSE
   ============================== */

if ($sent || $sheetSaved) {

    unset($_SESSION['csrf']);

    out(
        true,
        'Thank you. Your enquiry has been received. We will contact you shortly.'
    );
}


/* Both failed */
out(
    false,
    'Could not send your enquiry right now. Please call or WhatsApp +91 70204 04346.',
    500
);
