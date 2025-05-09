<?php
require './db/config.php';

$token = $_GET["token"] ?? "";

if (!$token) {
  echo "Invalid verification link";
  exit;
}

try {
  $stmt = $pdo->prepare("SELECT id FROM users WHERE verification_token = ?");
  $stmt->execute([$token]);

  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($user) {
    // Update the user to set the verification token to NULL and mark as verified
    $stmt = $pdo->prepare("UPDATE users SET verification_token = NULL, is_verified = 1 WHERE id = ?");
    $stmt->execute([$user["id"]]);
  } else {
    echo "Invalid or expired token.";
    exit;
  }


} catch (PDOException $e) {
  echo "Database error: " . $e->getMessage();
  exit;
}

if ($stmt->rowCount() > 0) {
  echo "✅ Your account is verified! You can now log in.";
} else {
  echo "❌ Invalid or expired token.";
}
?>
