<?php
/* Citabharat EV contact handler: CSRF, honeypot, rate limit, validation, email. */
session_set_cookie_params(['httponly'=>true,'secure'=>!empty($_SERVER['HTTPS']),'samesite'=>'Strict']);
session_start();
header('Content-Type: application/json'); header('Cache-Control: no-store');
const TO = 'sales@citabharatev.com';
const FROM = 'no-reply@citabharatev.com'; /* must be a mailbox on your domain */
const LIMIT = 5; const WINDOW = 3600;
function out($ok,$m,$c=200){http_response_code($c);echo json_encode(['ok'=>$ok,'message'=>$m]);exit;}
function clean($v,$max){$v=trim((string)$v);$v=preg_replace('/[\r\n]+/',' ',$v);return mb_substr($v,0,$max);}
if ($_SERVER['REQUEST_METHOD']!=='POST') out(false,'Invalid request.',405);
if (!empty($_POST['website'])) out(true,'Thank you. We will contact you shortly.'); /* honeypot */
$t = $_POST['csrf'] ?? '';
if (empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'],$t)) out(false,'Session expired. Please reload the page and try again.',403);
/* rate limit per IP using temp files */
$ip = $_SERVER['REMOTE_ADDR'] ?? 'x'; $f = sys_get_temp_dir().'/cita_rl_'.md5($ip); $now=time();
$hits = is_file($f) ? array_filter(array_map('intval',explode(',',file_get_contents($f))),fn($x)=>$x>$now-WINDOW) : [];
if (count($hits)>=LIMIT) out(false,'Too many requests. Please try again later or call +91 70204 04346.',429);
$hits[]=$now; file_put_contents($f,implode(',',$hits),LOCK_EX);
$name=clean($_POST['name']??'',80); $phone=clean($_POST['phone']??'',15); $email=clean($_POST['email']??'',120);
$city=clean($_POST['city']??'',80); $interest=clean($_POST['interest']??'',60); $model=clean($_POST['model']??'',120);
$company=clean($_POST['company']??'',100); $size=clean($_POST['size']??'',40); $budget=clean($_POST['budget']??'',40); $timeline=clean($_POST['timeline']??'',40); $power=clean($_POST['power']??'',40);
$msg=trim((string)($_POST['message']??'')); $msg=mb_substr($msg,0,2000); $det=mb_substr(trim((string)($_POST['details']??'')),0,1500);
if ($name===''||!preg_match('/^[+0-9 ]{8,15}$/',$phone)||!filter_var($email,FILTER_VALIDATE_EMAIL)) out(false,'Please check your name, phone and email.',422);
$body="New enquiry from citabharatev.com\n\nName: $name\nPhone: $phone\nEmail: $email\nCompany: $company\nCity: $city\nInterest: $interest\nModel: $model\nSite size: $size\nBudget: $budget\nTimeline: $timeline\nPower connection: $power\n\nMessage:\n$msg\n\nEstimate details:\n$det\n\nIP: $ip\n";
$h="From: ".FROM."\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";
$sent=mail(TO,'Website enquiry: '.$interest.' - '.$name,$body,$h);
if ($sent) { @mail($email,'We received your enquiry - Citabharat EV',"Hello $name,\n\nThank you for contacting Citabharat EV. Our team will call you shortly.\n\nCall/WhatsApp: +91 70204 04346\nsales@citabharatev.com\n",$h); }
unset($_SESSION['csrf']);
$sent ? out(true,'Thank you. Your enquiry has been sent. We will contact you shortly.') : out(false,'Could not send right now. Please call or WhatsApp +91 70204 04346.',500);
