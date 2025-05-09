<?php
require __DIR__ . '/../db/config.php';



$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"]);
$email = trim($data["email"]);
$password = $data["password"];

// create a default JSON response header
header('Content-Type: application/json; charset=utf-8');

// create a default JSON response body
$response = [
  "status" => "error",
  "message" => "An error occurred"
];

// check if all the required fields are provided
if (!$username || !$email || !$password) {
  http_response_code(400);
  $response["status"] = "error";
  $response["message"] = "All fields are required";
  echo json_encode($response);
  exit;
}

$token = bin2hex(random_bytes(32));
$hash = password_hash($password, PASSWORD_BCRYPT);

// Check if user exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->execute([$username, $email]);

if ($stmt->rowCount() > 0) {
  http_response_code(400);
  $response["status"] = "error";
  $response["message"] = "Username or email already exists";
  echo json_encode($response);
  exit;
}

// Add user to the database
try {
  $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, verification_token) VALUES (?, ?, ?, ?)");
  $stmt->execute([$username, $email, $hash, $token]);

  // Send verification email
  $subject = "Verify your TypeTurtle account";
  $verifyURL = $domain_root . "verify.php?token=$token";
  $body = "Welcome to TypeTurtle!\n\nClick to verify your account:\n$verifyURL";

  mail($email, $subject, $body, "From: TypeTurtle <noreply@ts944.brighton.domains>");

  http_response_code(200);
  $response["status"] = "success";
  $response["message"] = "Registration successful! Please check your email to verify.";
  echo json_encode($response);
  exit;

} catch (PDOException $e) {
  http_response_code(500);
  $response["status"] = "error";
  $response["message"] = "Database error: " . $e->getMessage();
  echo json_encode($response);
  exit;
}

?>
