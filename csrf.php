<?php
session_set_cookie_params(['httponly'=>true,'secure'=>!empty($_SERVER['HTTPS']),'samesite'=>'Strict']);
session_start();
if (empty($_SESSION['csrf'])) { $_SESSION['csrf'] = bin2hex(random_bytes(32)); }
header('Content-Type: application/json'); header('Cache-Control: no-store');
echo json_encode(['token' => $_SESSION['csrf']]);
