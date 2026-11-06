<?php

session_set_cookie_params([
    'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']),
    'samesite' => 'Strict'
]);

session_start();

header('Content-Type: application/json');
header('Cache-Control: no-store');

if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

echo json_encode([
    'ok' => true,
    'csrf' => $_SESSION['csrf']
]);
