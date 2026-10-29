<?php
/**
 * Device status endpoint.
 * Returns current status information for devices.
 */

header('Content-Type: application/json');

$status = [
    'device' => 'example-device',
    'online' => true,
    'temperature' => 22.4,
    'humidity' => 48,
    'last_updated' => date('c')
];

echo json_encode($status);
