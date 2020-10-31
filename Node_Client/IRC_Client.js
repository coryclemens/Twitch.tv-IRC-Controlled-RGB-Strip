/// AUTHOR : Cory Clemens
/// DATE   : 08 / 13 / 2020
/// DESC.  : The Twitch IRC client. Used for making
///          a socket connection to irc.chat.twitch.ttv
///          and recieves all raw chat data from server.

// Import
var net = require('net');

// Regex for pulling apart the IRC message format
const IRCreg = /^((?::[^\r\n ]+ ))([^\r\n ]+)(?: +([^:\r\n ]+[^\r\n ]*(?: +[^:\r\n ]+[^\r\n ]*)*))?(?: +:([^\r\n]*))?[\r\n]*$/

// Connect to IRC server through socket connection, returns socket into callback
var sox = new net.Socket();

sox.connect(6667, 'irc.chat.twitch.tv', () => {
    console.log('Connected via TCP to irc.chat.twitch.tv:6667...... ??\n');
    sox.write('PASS oauth:insertoauthhere\n');
    sox.write('NICK insertnickname\n');
    sox.write('JOIN #servername\n');
    process.send({ IRC_connected: 'true' });
});

// Emitted when data is recieved from server
sox.on('data', (chnk) => {
    // Log the chunk of data
    console.log(chnk.toString());

    // Send off for data parsing, handling, and queueing.
    // Wait for promise before moving on
    let res = ParseHandleQueue(chnk.toString())
        .then((res) => {
            console.log(res.toString());
        })
        .catch(error => { console.log('caught', error.message) });
});


async function ParseHandleQueue(chnk) {
    return new Promise((resolve, reject) => {
        try {
            // About once every five minutes, the server will send 
            // you a PING :tmi.twitch.tv. To ensure that your connection to the 
            // server is not prematurely terminated, reply with PONG :tmi.twitch.tv.
            // Reference --- https://dev.twitch.tv/docs/irc/guide/#connecting-to-twitch-irc
            if (chnk.includes('PING')) {
                sox.write('PONG :tmi.twitch.tv');
                resolve('Kept connection alive with PONG response to server.');
            }

            // Parse entire IRC message using regex to obtain message string
            let IRCParse = chnk.split(IRCreg);
            let message = IRCParse[4];

            // Handle into queue/request process
            let words = message.split(' ');
            for (var word of words) {
                if (word == "!red") {
                    process.send({ 'Request_Found': 'true', 'Request_Command': '/red', "user": IRCParse[3].toString() });
                    resolve(`Parsed and sent ${word} to main process`);
                }
                if (word == "!blue") {
                    process.send({ 'Request_Found': 'true', 'Request_Command': '/blue', "user": IRCParse[3].toString() });
                    resolve(`Parsed and sent ${word} to main process`);
                }
                if (word == "!party") {
                    process.send({ 'Request_Found': 'true', 'Request_Command': '/party', "user": IRCParse[3].toString() });
                    resolve(`Parsed and sent ${word} to main process`);
                }
            }
        }
        catch {
            reject(new Error('Error parsing recieved message..'));
        }
    })
}

// I think this is emitted by the server when it disconnects, 
// I have yet to see this be logged when closing the application.
sox.on('end', () => {
    console.log('Disconnecting....\n');
});

// Catch ctrl+c event and exit normally
process.on('SIGINT', function () {
    sox.write('PRIVMSG #nullcord :Bot exiting\n')
    sox.destroy();
    console.log('Ctrl-C...');
    process.exit(2);
});

// To be able to send simple debug messages between processes
process.on('message', (msg) => {
    console.log(`In [CHILD] client.js, message from [PARENT] index.js ${msg}`);
})
