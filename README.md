# Discord Bot V2

A Discord bot built with Discord.js v14, Firebase, and an Ollama-powered AI chat layer. It includes slash commands for moderation, utility checks, movie tracking, and message history, while also responding to direct mentions with a local AI assistant.

## Features

- Slash-command based bot interface using Discord.js v14
- AI assistant replies when the bot is mentioned in a guild
- Ollama integration with configurable model host, port, and model name
- Message tracking for deleted and edited messages
- Server and host connectivity checks
- Moderation warning storage with Firebase Firestore
- Movie list tracking stored in Firebase
- Fun utility commands like coin flips and a "winton" command
- Docker-ready deployment setup

## Command overview

### Utility
- `/ping` – Check the bot latency and API responsiveness
- `/help` – List available slash commands or view options for a specific command
- `/check-host` – Check whether a configured host accepts connections on a given port
- `/servers` – Check configured game server status

### Message tools
- `/snipe` – Show the most recently deleted message
- `/editsnipe` – Show the most recently edited message

### Moderation
- `/ban` – Add, view, and manage warning history for a user

### Fun
- `/coinflip` – Flip a coin
- `/movie` – Add, remove, and view the movie list
- `/winton` – Fun bot interaction command

### AI
- Mention the bot in a message to trigger a chat response using Ollama

## Tech stack

- Node.js
- Discord.js v14
- Firebase Admin SDK + Firestore
- Ollama for local LLM chat responses
- Docker / Docker Compose

## Project structure

```text
src/
├── bot.js                  # Bot bootstrap and startup
├── commands/              # Slash command definitions
├── events/                # Event handlers, including AI mention integration
├── functions/             # Loader utilities and handlers
├── assets/                # Static assets
└── deprecated/            # Legacy or unused code
```

## Prerequisites

Before running the bot, make sure you have:

- Node.js 18+ recommended
- A Discord bot token
- A Discord application/client ID
- Firebase project credentials for Firestore access
- An Ollama instance running locally or remotely

## Installation

1. Clone the repository:

```bash
git clone https://github.com/niazieo/Discord-Bot-V2.git
cd Discord-Bot-V2
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the required values:

```env
TOKEN="your_discord_bot_token"
CLIENTID="your_discord_application_client_id"

# Firebase
project_id="your_firebase_project_id"
private_key="your_firebase_private_key"
client_email="your_firebase_client_email"

# Ollama
OLLAMA_HOST="http://localhost"
OLLAMA_PORT="11434"
MODEL_NAME="qwen3:8b"

# Pterodactyl Panel
PTERO_API_KEY="your_pterodactyl_panel_api_key"
PTERO_URL="your_pterodactyl_panel_url"

# Local Server
SERVER_IP="localhost"
SERVER_PORT="your_server_port"
```

Notes:
- The app reads environment variables directly from `.env` at runtime.
- The Firebase and Discord configuration must be valid for the bot to register slash commands and access Firestore.
- If you use a different Ollama host or model, adjust the values accordingly.

4. Start the bot:

```bash
npm start
```

## Docker deployment

A basic Docker Compose setup is included in `compose.yaml` for containerized deployment.

```bash
docker compose up --build
```

The compose file expects an environment file named `.env` and runs the bot from the repository root.

## Notes

- Slash commands are refreshed automatically when the bot starts.
- AI replies are triggered by mentioning the bot in a message, not by prefix commands.
- Firebase is used for persistent moderation warnings and movie list storage.

## License

ISC

## Author

Omar ([@niazieo](https://github.com/niazieo))
