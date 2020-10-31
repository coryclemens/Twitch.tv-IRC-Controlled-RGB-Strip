/// AUTHOR : Cory Clemens
/// DATE   : 08 / 13 / 2020
/// DESC.  : The main process; forks two child processes and
///          orchestrates the communication of all data coming
///          from the Twitch IRC server, and going out to the 
///          Arduino Yun server.

// Import
const { fork } = require('child_process');

// Starts the twitch IRC client to parse chat messages
// as they come in, and adds them to the command queue
var IRCTwitchClient = fork('./IRC_Client.js');

// IPC for IRC Client (mainly debug)
IRCTwitchClient.on('message', (msg) => {
    if (msg['IRC_connected'] == "true") {
        console.log(`From [CHILD] /client.js: IRC_connected: ${msg['IRC_connected']}`);
    }
    if (msg['Request_Found'] == "true") {
        console.log(`From [CHILD] /client.js: Request_Found: ${msg['Request_Found']}`);
        console.log(`From [CHILD] /client.js: Request_Command: ${msg['Request_Command']}`);
        passToRequestClient({ "request": msg['Request_Command'], "userName": msg['user'] });
    }

});

// Starts the webserver request client
var RequestClient = fork('request_Client.js');

RequestClient.on('message', (msg) => {
    console.log(msg);
})

function passToRequestClient(msg) {
    RequestClient.send(msg);
}
