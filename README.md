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

## Installation

### Prerequisites

- Node v12+
- MySQL 5.7+

### Setup

- Install npm packages
```bash
npm install
```

- Create an .env file (and fill it out)
```bash
cp .env.example .env
```

- Set up the database
```bash
npm run migrate
```

- Start the bot
```bash
npm start
```

## npm scripts (for development)

- `npm run make:command <name>` Create a command
- `npm run make:function <name>` Create a function
- `npm run make:middleware <name>` Create a middleware