<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once dirname(__DIR__, 2) . '/private/config.php';

function respond(int $code, array $data): never {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'POST required']);
}

$token = $_SERVER['HTTP_X_DEVICE_TOKEN'] ?? '';
if (!hash_equals(DEVICE_API_TOKEN, $token)) {
    respond(401, ['ok' => false, 'error' => 'Unauthorized']);
}

$input = json_decode(file_get_contents('php://input'), true);
if (
    !is_array($input) ||
    ($input['device_id'] ?? '') !== DEVICE_ID ||
    !isset($input['state']) ||
    !in_array($input['state'], [0, 1, '0', '1'], true)
) {
    respond(400, ['ok' => false, 'error' => 'Invalid payload']);
}

$state = (int) $input['state'];

try {
    $pdo = db();
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        'INSERT INTO device_events (device_id, event_type, output_state, source)
         VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([DEVICE_ID, 'led_state', $state, 'device']);

    $stmt = $pdo->prepare(
        'INSERT INTO device_status (device_id, output_state, source)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
         output_state = VALUES(output_state),
         source = VALUES(source),
         last_seen = CURRENT_TIMESTAMP'
    );
    $stmt->execute([DEVICE_ID, $state, 'device']);

    $pdo->commit();
    respond(200, ['ok' => true, 'device_id' => DEVICE_ID, 'state' => $state]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Smart-home event API failed');
    respond(500, ['ok' => false, 'error' => 'Server error']);
}
