# cPanel deployment checklist

1. Create a MySQL/MariaDB database and database user in cPanel. Grant the user privileges on that database.
2. Run `database/schema.sql` in phpMyAdmin after selecting the newly created database.
3. Create a `private` directory outside `public_html`.
4. Copy `private/config.example.php` to that private directory as `config.php`. Fill in the actual cPanel database name/user/password and a long random device token.
5. Upload `public_html/index.html` to the domain's document root and the `public_html/api/` files to the `api` subfolder.
6. If your document root is not `public_html`, adapt the paths and URL.
7. Confirm that HTTPS works.
8. Upload `firmware/esp8266-led-test.ino` to the NodeMCU ESP8266 from Arduino IDE after replacing Wi-Fi credentials, API URL, and device token.
9. Open Serial Monitor at 115200 baud. Press/release the test button and inspect HTTP responses.
10. In phpMyAdmin, run:
    SELECT * FROM device_status WHERE device_id = 'mk-led-01';
    SELECT * FROM device_events WHERE device_id = 'mk-led-01' ORDER BY id DESC LIMIT 20;

Security:
- Never commit real credentials/tokens to GitHub.
- Do not put the private config inside the public document root.
- The firmware's `setInsecure()` is for prototype testing only and does not validate the server certificate.
- Do not connect mains wiring to the breadboard. This is a low-voltage prototype.
- Dashboard state means reported software state, not measured actual electrical power.
