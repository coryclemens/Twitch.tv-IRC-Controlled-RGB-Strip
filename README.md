# Twitch.tv Controlled RGB Strip (For an Ultimate Streamer/Viewer Connection)

## Summary
**Twitch.tv** is a streaming platform that has taken the world by storm in the last 10 years, spawning millions of different ways that viewers can interact with their favorite streamers online.
These interactions usually happen with the help of **chat bots**; this is exactly what I aim to create with this project, without the help of the various Twitch.tv node packages that could be used to make it easier.

**In summary, the project is this:** 

```diff
+ Allow chatters of a particular streamer enter color commands in the IRC protocol chat server (!red, !blue, !party, etc.)
+ My bot (made from base Node.js - no npm packages) will use socket connections to create a TCP connection to the IRC server (which is an application layer protocol), and intercept these messages from chat, placing them in a custom queue.
+ This client (Node.js bot) will then make POST requsts to an API I set up on an Arduino Yun, which will handle these requests, and change the RGB strip color.
```
