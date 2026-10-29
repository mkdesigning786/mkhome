<?php
/**
 * Device event endpoint for smart home integration.
 * Accepts POST requests with device activity updates.
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$response = [
    'status' => 'ok',
    'message' => 'Event received',
    'payload' => $input ?? []
];

echo json_encode($response);
