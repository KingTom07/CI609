<?php

$host = "localhost";                // Database host (usually localhost)
$dbname = "ts944_typeturtle";       // Database name  
$user = "ts944_User";                     // Database username 
$pass = "cFZ}{5?}grth";                     // Database password
$port = "3306";                     // Database port (usually 3306)

// Domain root URL for API requests
$domain_root = "https://ts944.brighton.domains/TypeTurtle/";
//$domain_root = "http://localhost:8888/game2/";


try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("Database connection failed: " . $e->getMessage());
}
?>
