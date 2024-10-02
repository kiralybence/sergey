# Sergey

Sergey is a Discord bot I've created for experimenting. The bot itself is private, there is no invite link.

## Features

- Study users' messages and generate a fake message to imitate a person
    - This is the main functionality of the bot.
    - There is no AI involved. It's 100% my own algorithm.
> [!WARNING]  
> The bot exports and stores users' messages into the database without asking for explicit consent beforehand. I only use this bot in a private server with members who have given me verbal consent. If you want to use this bot in a public server, you must implement some kind of a consent functionality (a `/consent` command for example).

- Automatically react to a message with a specific emote if a specific keyword was detected
- Automatically reply to a message with a specific text if a specific keyword was detected
- Grab a random image from the internet with the given keywords
- Grab a random image from the top posts of a Reddit subreddit
- Track League of Legends players and send a message to the chat whenever they win/lose (TODO)
- Insult someone in the chat with a random insult
- Roll 1-100 against the bot (with the ability to rig the rolls for certain users)

...and more.

## Installation

### Prerequisites

- Node
- MySQL

### Getting started

- Install dependencies
```bash
npm install
```

- Create an .env file **(and fill it out)**
```bash
cp .env.example .env
```

- Set up the database (TODO)
```bash
npm run migrate
```

- Start the bot
```bash
npm start
```
