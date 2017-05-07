#include <Servo.h> 

#define SERVO_PWM_PIN 23
#define SERVO_PUSH_CMD 'p'   // push: when sent, we push the Spectacles button
#define SERVO_TELL_CMD 't'   // tell: when sent, we tell the caller we are alive
#define SERVO_REST_ANGLE 180
#define SERVO_PUSH_ANGLE 110

Servo servo;

void setup() 
{
  // Attach to the physical PWM pin
  servo.attach(SERVO_PWM_PIN); 
  // On setup, leave the Servo at rest
  servo.write(SERVO_REST_ANGLE);
}

void loop() 
{ 
  // Is serial data available?
  if (Serial.available()) {
    // Get the command
    char cmd = Serial.read();
    // Should we push?
    if (cmd == SERVO_PUSH_CMD) {
      servo.write(SERVO_PUSH_ANGLE);  // push
      delay(500);           // hold
      servo.write(SERVO_REST_ANGLE);  // pull
    }
    else
    if (cmd == SERVO_TELL_CMD) {
      Serial.write("hi");
    }
  }
}
