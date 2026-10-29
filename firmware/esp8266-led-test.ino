#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>

const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Change this if your domain or API path is different.
const char* API_URL = "https://mkdesigning.in/api/device-event.php";

// Must match DEVICE_API_TOKEN in your private config.php.
const char* DEVICE_TOKEN = "REPLACE_WITH_YOUR_DEVICE_TOKEN";
const char* DEVICE_ID = "mk-led-01";

const uint8_t LED_PIN = D1;
const uint8_t SWITCH_PIN = D5;

bool lastReportedState = false;

bool readSwitchState() {
  return digitalRead(SWITCH_PIN) == LOW;
}

bool sendState(bool state) {
  // PROTOTYPE ONLY: does not validate the server's TLS certificate.
  // Replace with proper certificate validation before production.
  BearSSL::WiFiClientSecure client;
  client.setInsecure();

  HTTPClient https;
  if (!https.begin(client, API_URL)) {
    Serial.println("HTTPS begin failed");
    return false;
  }

  https.addHeader("Content-Type", "application/json");
  https.addHeader("X-Device-Token", DEVICE_TOKEN);

  String payload = String("{\"device_id\":\"") + DEVICE_ID +
                   "\",\"state\":" + (state ? "1" : "0") +
                   ",\"source\":\"device\"}";

  int code = https.POST(payload);
  String response = https.getString();
  Serial.printf("HTTP status: %d\n", code);
  Serial.println(response);
  https.end();

  return code >= 200 && code < 300;
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(SWITCH_PIN, INPUT_PULLUP);
  digitalWrite(LED_PIN, LOW);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Wi-Fi IP: ");
  Serial.println(WiFi.localIP());

  lastReportedState = readSwitchState();
  digitalWrite(LED_PIN, lastReportedState ? HIGH : LOW);
  if (WiFi.status() == WL_CONNECTED) {
    sendState(lastReportedState);
  }
}

void loop() {
  bool currentState = readSwitchState();
  if (currentState != lastReportedState) {
    delay(40); // basic debounce
    currentState = readSwitchState();

    if (currentState != lastReportedState) {
      digitalWrite(LED_PIN, currentState ? HIGH : LOW);

      if (WiFi.status() == WL_CONNECTED && sendState(currentState)) {
        lastReportedState = currentState;
      } else {
        Serial.println("Update failed; will retry");
      }
    }
  }
  delay(20);
}
