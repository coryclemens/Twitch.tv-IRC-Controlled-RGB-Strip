# Twitch.tv Controlled RGB Strip (For an Ultimate Streamer/Viewer Connection)

## Summary
Twitch.tv is a streaming platform that has taken the world by storm in the last 10 years, spawning millions of different ways that viewers can interact with their favorite streamers.
These interactions usually happen with the help of bots. This is exactly what I aimed to create with this project.

In summary, the project is this: allow chatters of a particular streamer enter color commands in the IRC protocol chat server (!red, !blue, !party, etc.)

My bot (made from base Node.js and no packages) will use socket connections to intercept these messages from chat, placing them in a custom queue.
This client will then make POST requsts to an API I set up on an Arduino Yun, which will then handle these requests, and change the RGB strip color.
