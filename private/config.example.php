<?php
declare(strict_types=1);

/*
 * Copy this file to a private directory OUTSIDE public_html and rename it config.php.
 * Never commit real credentials or tokens to GitHub.
 */

const DB_HOST = 'localhost';
const DB_NAME = 'CPANEL_PREFIX_mkhome';
const DB_USER = 'CPANEL_PREFIX_mkdevice';
const DB_PASS = 'REPLACE_WITH_DATABASE_PASSWORD';

const DEVICE_ID = 'mk-led-01';
const DEVICE_API_TOKEN = 'REPLACE_WITH_LONG_RANDOM_TOKEN';

function db(): PDO {
    return new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
}
