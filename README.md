# MK DESIGNING SMART HOME — ESP8266 LED to Database Prototype

This starter project sends a low-voltage LED/button state from a NodeMCU ESP8266 to a PHP API hosted on cPanel, stores events in MySQL/MariaDB, and displays the latest reported state in a web dashboard.

## Project structure

- `public_html/index.html` — simple dashboard
- `public_html/api/device-event.php` — authenticated device event endpoint
- `public_html/api/device-status.php` — dashboard read-only status endpoint
- `private/config.example.php` — copy to `config.php` outside `public_html` and fill in credentials
- `database/schema.sql` — creates the two database tables
- `firmware/esp8266-led-test.ino` — NodeMCU ESP8266 low-voltage LED/button prototype
- `.gitignore` — excludes secrets

## Before deploying

1. In cPanel, create a MySQL/MariaDB database and user; grant the required privileges.
2. Run `database/schema.sql` in phpMyAdmin against that database.
3. Copy `private/config.example.php` to a private folder outside `public_html`, rename it to `config.php`, and replace placeholders.
4. Upload `public_html/index.html` and `public_html/api/` to the domain document root.
5. Ensure HTTPS is working.
6. In the ESP8266 sketch, set Wi-Fi credentials, API URL, and the same device token used by the PHP config.
7. Open Serial Monitor at 115200 baud.

## Important safety/security notes

- Never commit actual Wi-Fi passwords, database passwords, or API tokens to GitHub.
- Do not expose `private/config.php` under `public_html`.
- The firmware currently uses `client.setInsecure()` for prototype-only TLS testing. It does not verify the server certificate. Replace it with proper certificate validation before production.
- This is a low-voltage breadboard prototype only. Never connect mains/wall wiring to the ESP8266 or breadboard. Use proper isolation and a qualified electrician for mains installation.
- The dashboard shows the last state reported by the firmware, not measured electrical power. Actual power feedback requires a suitable isolated sensor.
- This prototype has basic retry behavior only and no durable offline event queue.
