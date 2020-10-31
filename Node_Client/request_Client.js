/// AUTHOR : Cory Clemens
/// DATE   : 08 / 13 / 2020
/// DESC.  : The request client, that will hit the
///          Arduino Yun web server.

// Time to wait in between requests in seconds
const TIMETOWAIT = 10;
// Max amount of requests to be stored in the array
const MAXREQUESTS = 50;

// Use node.js standard module to make POST requests to Arduino Yun server
const http = require('http');

var options = {
    'method': 'POST',
    'hostname': 'arduino.local',
    'path': '',
    'headers': {
    },
    'maxRedirects': 20
};

// Empty array that will queue request objects
// [{request: "/red", user: "userName"}, ...]
var requestStorage = [];

var requestInterval = setInterval(request_ShiftQueue, (TIMETOWAIT * 1000))

process.on('message', (msg) => {
    console.log('From [PARENT] index.js in requestClient: ', msg)

    if (requestStorage.length < MAXREQUESTS) {
        requestStorage.push(msg);
    }
});

function request_ShiftQueue() {
    if (requestStorage.length > 0) {
        var nextInQueue = requestStorage.shift();
        console.log("Making request with objects:", nextInQueue);

        // MAKE HTTP REQUEST HERE
        // -> IF SUCCESS, SEND USERNAME TO PARENT
        // -> SEND USERNAME TO TWITCH IRC CLIENT
        // -> WRITE ("USERNAME's COMMAND EXECUTED") IN CHAT

        // Set path of request based on next request stored in queue
        options['path'] = '/arduino/strip' + nextInQueue['request'];

        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });

            res.on("error", function (error) {
                console.error(error);
            });
        });

        req.end();

    }
    else {
        console.log("Queue is empty, no request made");
    }
}