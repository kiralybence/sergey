# Sergey

Sergey is a Discord bot I've created for experimenting. The bot itself is private, there is no invite link.

## Main features

- Study users' messages and generate a fake message to imitate a person's writing style
- Try to interpret the meaning of a question and then answer it (heavily experimental)
- Automatically react to a message with a specific emote if a specific keyword was detected
- Grab a random image from Bing Image Search
- Grab a random image from the top posts of a Reddit subreddit
- MyAnimeList search

## Warning

The bot exports and stores users' messages into the database without asking for explicit consent beforehand. I only use this bot in a private server with members who have given me verbal consent. If you want to use this bot in a public server, you must implement some kind of a consent functionality (a `!trackme` command for example).

## npm scripts

- `npm start` Start the bot
- `npm run migrate` Set up the database
- `npm run make:command <name>` Create a command
- `npm run make:function <name>` Create a function
- `npm run make:middleware <name>` Create a middleware