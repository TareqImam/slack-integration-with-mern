# Slack Integration Test App

A MERN stack application that demonstrates Slack integration using the Slack Web API.

## Features

- Fetch messages from any Slack channel (public, private, or group DMs)
- Post messages to any Slack channel
- Modern UI built with React and Chakra UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Slack workspace where you can create apps
- A Slack bot token with the following scopes:
  - `chat:write`
  - `channels:history`
  - `groups:history`
  - `im:history`
  - `mpim:history`

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Get your Slack Bot Token:
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Create a new app or select an existing one
   - Navigate to "OAuth & Permissions"
   - Add the required scopes mentioned above
   - Install the app to your workspace
   - Copy the "Bot User OAuth Token" (starts with `xoxb-`)
   - Add the token to your `.env` file:
     ```
     SLACK_BOT_TOKEN=xoxb-your-token-here
     ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser to `http://localhost:5173` (or the port shown in your terminal)
2. Enter a Slack channel ID in the "Channel ID" field
   - For public channels: `C` followed by numbers/letters
   - For private channels: `G` followed by numbers/letters
   - For DMs: `D` followed by numbers/letters
3. Click "Fetch Messages" to see recent messages
4. Type a message and click "Post Message" to send it to the channel

## Troubleshooting

- If you get a "channel_not_found" error, make sure:
  - The channel ID is correct
  - The bot has been added to the channel
  - The bot has the necessary permissions
- If you get a "not_in_channel" error, add the bot to the channel first
- If messages aren't showing up, check the browser console and backend logs for errors

## Security Notes

- Never commit your `.env` file or share your Slack token
- The current CORS configuration allows all origins (for development only)
- For production, configure specific allowed origins 