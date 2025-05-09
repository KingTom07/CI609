<?php
header("Content-Type: application/json");
require __DIR__ . '/../db/config.php';



// What request does the user want to make?
$method = $_SERVER['REQUEST_METHOD'];

// Get the request URI and parse it
$input = json_decode(file_get_contents('php://input'), true);

// create a JSON response
header('Content-Type: application/json');

// Check if the input is valid JSON
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

// create a default JSON response message
$response = [
  "status" => "error",
  "message" => "An error occurred."
];

// Get the last part of the URI, this is the User ID and is used if the user wants to get a single user
$id = end($uri);

switch ($method) {
    case 'GET':
        if (is_numeric($id)) {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                exit;
            }
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } else {
            $stmt = $pdo->query("SELECT * FROM users");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        
        // return an message to say the /register endpoint should be used to create a new user
        http_response_code(400);
        echo json_encode(['error' => 'Use /register endpoint to create a new user']);
        exit;
        
        break;

    case 'PUT':
        if (is_numeric($id)) {
            $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
            $stmt->execute([$input['username'], $input['email'], $id]);
            echo json_encode(['message' => 'User updated']);
        }
        break;

    case 'DELETE':
        if (is_numeric($id)) {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['message' => 'User deleted']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
}
?>