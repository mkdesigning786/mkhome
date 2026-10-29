<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

require_once dirname(__DIR__, 2) . '/private/config.php';

try {
    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT device_id, output_state, source, last_seen
         FROM device_status WHERE device_id = ?'
    );
    $stmt->execute([DEVICE_ID]);
    $row = $stmt->fetch();

    echo json_encode(['ok' => true, 'device' => $row ?: null]);
} catch (Throwable $e) {
    error_log('Smart-home status API failed');
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server error']);
}
