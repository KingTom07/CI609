<?php
header('Content-Type: application/json');
ob_start();

require __DIR__ . '/../db/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing email or password"]);
    exit;
}

$email = $data['email'];
$password = $data['password'];

// Check if user exists
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid email or password"]);
    exit;
}

// Generate a new token
$token = bin2hex(random_bytes(32));

// Save token in DB
$stmt = $pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
$stmt->execute([$token, $user['id']]);

// Send token back to frontend
echo json_encode(["token" => $token]);