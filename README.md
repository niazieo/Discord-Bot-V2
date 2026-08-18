# Discord Bot V2
A modern Discord bot built with **Discord.JS V14** and **Firebase Firestore**, featuring slash commands, AI integration, and moderation tools.

## 🚀 Features

- **Slash Commands** - Modern slash command interface for all bot interactions
- **AI Integration** - Built-in LLM integration from OpenRouter (mention the bot to chat)
- **Message Tracking** - Snipe deleted and edited messages
- **Fun Commands** - Coin flips, movie lookups, and more
- **Haiku Detection** - Automatic detection and sharing of haikus in chat
- **Firebase Backend** - Persistent data storage with Firestore

## 📋 Commands

### Utility
- `/ping` - Check bot latency and API response time
- `/help` - Display available commands and usage

### Message Tools
- `/snipe` - Retrieve the most recently deleted message
- `/editsnipe` - Retrieve the most recently edited message

### Moderation
- `/banwarning` - Warns a user from the server

### Fun
- `/coinflip` - Flip a coin (Heads or Tails)
- `/movie` - Contribute to or view the movie list
- `/winton` - Winton

### AI Chat
- Mention the bot in any message to chat with the AI

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Discord.JS v14.3.0
- **Database**: Firebase Admin SDK & Firestore
- **AI Model**: OpenRouter LLM Integration
- **Deployment**: Docker

## 📦 Installation

### Prerequisites
- Node.js (latest stable version)
- Discord Bot Token
- Firebase credentials
- OpenRouter API key (for AI features)

### Setup

1. Clone the repository
```bash
git clone https://github.com/niazieo/Discord-Bot-V2.git
cd Discord-Bot-V2
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your credentials:
```
DISCORD_TOKEN=your_bot_token
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
OPENROUTER_API_KEY=your_openrouter_key
CLIENTID=your_bot_discord_client_id
```

4. Start the bot
```bash
npm start
```

## 🐳 Docker Deployment (WIP)

Build and run with Docker:
```bash
docker build -t discord-bot-v2 .
docker run --env-file .env discord-bot-v2
```

## 📝 License

ISC

## 👤 Author

Omar ([@niazieo](https://github.com/niazieo))
