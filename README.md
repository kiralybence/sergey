# Sergey

Sergey is a Discord bot I've created for experimenting. The bot itself is private, there is no invite link.

## Features

- Study users' messages and generate a fake message to imitate a person
    - This is the main functionality of the bot.
    - There is no AI involved. It's 100% my own algorithm.
> [!WARNING]  
> The bot exports and stores users' messages into the database without asking for explicit consent beforehand. I only use this bot in a private server with members who have given me verbal consent. If you want to use this bot in a public server, you must implement some kind of a consent functionality (a `/consent` command for example).

- Count how many times someone has used a specific word
- Check who uses a certain word the most often
- Automatically react to a message with a specific emote if a specific keyword was detected
- Automatically reply to a message with a specific text if a specific keyword was detected
- Grab a random image from the internet with the given keywords
- Grab a random image from the top posts of a Reddit subreddit
- Track League of Legends players and send a message to the chat whenever they lose
- Insult someone in the chat with a random insult
- Roll 1-100 against the bot (with the ability to rig the rolls for certain users)
- Send scheduled messages

...and more.

## Installation

### Prerequisites

- Node.js
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

- Set up the database
```bash
node migrate.js
```

- Fill up the database (optional)
    - Fill the `auto_reactions` table with your own reactions
    - Fill the `auto_replies` table with your own replies
    - Fill the `emotes` table with your own emotes
        - This is for internal functionalities only. Some of the commands use emotes in the replies, and they are fetched from the database (using this format: `<:name:id>`). If the requested emote isn't found in the database, a fallback emoji will be used instead.
    - Fill the `insults` table with your own insults
    - Fill the `fetchable_channels` table with Discord channel IDs you want to study user messages from
    - Fill the `rigged_roll_users` table with your own riggings
    - Fill the `tracked_lol_users` table with League of Legends players you want to track
    - Fill the `scheduled_messages` table with your own scheduled messages

- Start the bot
```bash
node bot.js
```

- Run the `/fetchall` command to fetch all user messages (optional)
    - This might take a while. Fetching 1 million words (3-4 years of messages from 9 channels) took me 40-60 minutes to fetch.
