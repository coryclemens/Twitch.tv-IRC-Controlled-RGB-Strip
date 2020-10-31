# Twitch.tv Controlled RGB Strip (For an Ultimate Streamer/Viewer Connection)

## Summary
**Twitch.tv** is a streaming platform that has taken the world by storm in the last 10 years, spawning millions of different ways that viewers can interact with their favorite streamers online.
These interactions usually happen with the help of **chat bots**; this is exactly what I aim to create with this project, without the help of the various Twitch.tv node packages that could be used to make it easier.

**In summary, the project is this:** 
+ Allow chatters of a particular streamer enter color commands in the IRC protocol chat server (!red, !blue, !party, etc.)
+ My bot (made from base Node.js - no npm packages) will use socket connections to create a TCP connection to the IRC server (which is an application layer protocol), and intercept these messages from chat, placing them in a custom queue.
+ This client (Node.js bot) will then make POST requsts to an API I set up on an Arduino Yun, which will handle these requests, and change the RGB strip color.

## Demonstration
In this first gif, we can see the starting of the local Node client (chat bot), and see the initial errors thrown due to the inital IRC connection messages (which are not formatted similar to a regular message in the chat server).

![Gif_1](https://github.com/coryclemens/Twitch.tv-IRC-Controlled-RGB-Strip/blob/master/README_imgs/1.gif)

Next, we type a command in the Twitch chat, !blue. You can see the object that the request client will make to the Arduino API, and a succesful response from the API once the color has been changed.

![Gif_2](https://github.com/coryclemens/Twitch.tv-IRC-Controlled-RGB-Strip/blob/master/README_imgs/2.gif)

Now lets fill the queue with a few commands...

![Gif_3](https://github.com/coryclemens/Twitch.tv-IRC-Controlled-RGB-Strip/blob/master/README_imgs/3.gif)

Party mode request activated.

![Gif_4](https://github.com/coryclemens/Twitch.tv-IRC-Controlled-RGB-Strip/blob/master/README_imgs/4.gif)

Now for red..

![Gif_5](https://github.com/coryclemens/Twitch.tv-IRC-Controlled-RGB-Strip/blob/master/README_imgs/5.gif)

And blue again! We can also see the bot exiting upon killing the main node process.

![Gif_6](https://github.com/coryclemens/Twitch.tv-IRC-Controlled-RGB-Strip/blob/master/README_imgs/6.gif)
