// AUTHOR      : CORY CLEMENS
// DATE        : 09/04/2020
// DESCRIPTION : A server hosted on the Arduino Yun in order to recieve post requests;
//               this will change the color of the RGB LED strip in my room over the network.
//               These POST calls are made from the Twitch IRC Client running on
//               my local PC, which is constantly parsing a live application layer
//               IRC server in order to determine if a 'chatter' has put in a command. 


// List of current supported POST commands
/*
  "/arduino/strip/red"   
  "/arduino/strip/blue"  
  "/arduino/strip/party" 
*/

// Server and LED libs
#include <Bridge.h>
#include <BridgeServer.h>
#include <BridgeClient.h>
#include <FastLED.h>

// WS2811 Strip has 300 LED's, but groups of 3 controlled by 1 I.C. (R-G-B)
#define NUM_LEDS 100 
#define DATA_PIN 3

// Create global variables
CRGB leds[NUM_LEDS];
BridgeServer server;
int state = 0;

void setup() {
  // Initialize the LED object
  Serial.begin(9600);
  Serial.println("resetting");
  LEDS.addLeds<WS2812,DATA_PIN,BRG>(leds,NUM_LEDS);
  LEDS.setBrightness(84);
  
  // Bridge startup
  pinMode(13,OUTPUT);
  digitalWrite(13, LOW);
  Bridge.begin();
  digitalWrite(13, HIGH);

  server.begin();
}

void loop() {
  // Scan for new client
  BridgeClient cl = server.accept();

  // If new client found
  if (cl) {
    // Send client command to be processed 
    cmd(cl);

    // Close connection and free resources.
    cl.stop();
  }

  delay(50);

   switch(state){
    case 0: for(int i = 0; i < NUM_LEDS; ++i){
                leds[i] = CRGB::Red;
            }
            FastLED.show();
            break;
    case 1: for(int i = 0; i < NUM_LEDS; ++i){
                leds[i] = CRGB::Blue;
            }
            FastLED.show();
            break;
    case 2: static uint8_t hue = 0;
            for(int i = 0; i < NUM_LEDS; i++) {
              // Set the i'th led to red 
              leds[i] = CHSV(hue++, 255, 255);
              // Show the leds
              FastLED.show(); 
              // now that we've shown the leds, reset the i'th led to black
              fadeall();
              // Wait a little bit before we loop around and do it again
              delay(10);
            }
            break;
    default: for(int i = 0; i < NUM_LEDS; ++i){
                leds[i] = CRGB::Red;
            }
            FastLED.show();
            break;
   }
}

void cmd(BridgeClient cl) {
  // Find first POST arg
  String arg = cl.readStringUntil('/');

  if (arg == "strip") {
    stripCommand(cl);
  }
}

void stripCommand(BridgeClient cl){

      // If the next character is not a '/' -- bad URL
      if (cl.read() != '/') {
        cl.println(F("error"));
        return;
      }
      
      // Get color of request
      String str = cl.readStringUntil('\r');
      
      if(str == "red"){
        state = 0; 
        cl.print(str);
      }
      else if(str == "blue"){
        state = 1; 
        cl.print(str);
      }
      else if(str == "party"){
        state = 2; 
        cl.print(str);
      }
      else{
        state = 0; 
        cl.print(str);
      }
}

void fadeall() { for(int i = 0; i < NUM_LEDS; i++) { leds[i].nscale8(250); } }
