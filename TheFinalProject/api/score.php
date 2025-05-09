<?php
header("Content-Type: application/json");
require 'https://ts944.brighton.domains/TypeTurtle/db/config.php';

// What request does the user want to make?
$method = $_SERVER['REQUEST_METHOD'];

// Get the request URI and parse it
$input = json_decode(file_get_contents('php://input'), true);

// Check if the input is valid JSON
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

// Get the last part of the URI, this is the User ID and is used if the user wants to get a single user
$id = end($uri);

switch ($method) {
    case 'GET':
        if (is_numeric($id)) {
            // return all scores for a user
            $stmt = $pdo->prepare("SELECT * FROM scores WHERE user_id = ?");
            $stmt->execute([$id]);
            
            // return the scores
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            
        } else {
            $stmt = $pdo->query("SELECT * FROM scores");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        // prepare the SQL statement
        $stmt = $pdo->prepare("INSERT INTO scores (user_id, score, wpm, accuracy, time_taken, created_at) VALUES (?, ?, ?, ?, ?, ?)");

        // Set default values for optional fields
        $input['created_at'] = $time_now;
        $input['user_id'] = isset($input['user_id']) ? $input['user_id'] : null;
        $input['score'] = isset($input['score']) ? $input['score'] : null;
        $input['wpm'] = isset($input['wpm']) ? $input['wpm'] : null;
        $input['accuracy'] = isset($input['accuracy']) ? $input['accuracy'] : null;
        $input['time_taken'] = isset($input['time_taken']) ? $input['time_taken'] : null;
        $input['created_at'] = isset($input['created_at']) ? $input['created_at'] : date('Y-m-d H:i:s');

        $stmt->execute([$input['user_id'], $input['score'], $input['wpm'], $input['accuracy'], $input['time_taken'], $input['created_at']]);

        echo json_encode(['message' => 'Score created', 'id' => $pdo->lastInsertId()]);

        break;

    case 'PUT':
        if (is_numeric($id)) {
            $stmt = $pdo->prepare("UPDATE scores SET user_id = ?, score = ?, wpm = ?, accuracy = ?, time_taken = ?, created_at = ? WHERE id = ?");
            // Set default values for optional fields
            $input['user_id'] = isset($input['user_id']) ? $input['user_id'] : null;
            $input['score'] = isset($input['score']) ? $input['score'] : null;
            $input['wpm'] = isset($input['wpm']) ? $input['wpm'] : null;
            $input['accuracy'] = isset($input['accuracy']) ? $input['accuracy'] : null;
            $input['time_taken'] = isset($input['time_taken']) ? $input['time_taken'] : null;
            $input['created_at'] = isset($input['created_at']) ? $input['created_at'] : date('Y-m-d H:i:s');
            $stmt->execute([$input['user_id'], $input['score'], $input['wpm'], $input['accuracy'], $input['time_taken'], $input['created_at'], $id]);
            
            // Check if the update was successful
            if ($stmt->rowCount() > 0) {
                echo json_encode(['message' => 'Score updated']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Score not found']);
            }
        }
        break;

    case 'DELETE':
        if (is_numeric($id)) {
            $stmt = $pdo->prepare("DELETE FROM scores WHERE id = ?");
            // Check if the score exists before deleting
            $stmt->execute([$id]);
            echo json_encode(['message' => 'Score deleted']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
}
?>