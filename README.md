# Politician Disclosure Bot

A Telegram bot built with [Bun](https://bun.sh), TypeScript, and [Telegraf](https://github.com/telegraf/telegraf). It periodically checks new financial disclosures from the U.S. House Clerk’s website, and sends PDFs of newly published forms to all subscribed Telegram users.

## Features

- **Periodic Checks**: Uses [`node-cron`](https://www.npmjs.com/package/node-cron) to fetch new disclosures every minute from [disclosures-clerk.house.gov](https://disclosures-clerk.house.gov/).
- **PDF Downloads**: Automatically downloads the PDF for each new filing and broadcasts it.
- **User Subscriptions**: Telegram users just type `/start` to subscribe; the bot stores their chat ID and sends updates to them.
- **Bun Runtime**: Utilizes Bun for speed and simplicity.
- **Twitter Integration**: Posts new disclosures to Twitter using the [Twitter API](https://developer.twitter.com/en/docs/twitter-api).

## Requirements

- [Bun v1.1.37 or higher](https://bun.sh)
- A valid **Telegram Bot Token** (from [@BotFather](https://t.me/BotFather))
- Twitter API credentials (App Key, App Secret, Access Token, Access Secret)

## Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/kyrylolvov/politician-disclosures-bot.git
    cd politician-disclosure-bot
    ```

2. **Install dependencies**:
    ```sh
    bun install
    ```

3. **Create a `.env` file**:
    ```sh
    touch .env
    ```

    Add your environment variables to the `.env` file:
    ```
    TELEGRAM_BOT_TOKEN=your_telegram_bot_token
    TWITTER_APP_KEY=your_twitter_app_key
    TWITTER_APP_SECRET=your_twitter_app_secret
    TWITTER_ACCESS_TOKEN=your_twitter_access_token
    TWITTER_ACCESS_SECRET=your_twitter_access_secret
    ```

4. **Run the bot**:
    ```sh
    bun run ./src/index.ts
    ```

## Project Structure

- `src/index.ts`: Main entry point. Initializes the bot, sets up cron jobs, and processes disclosures.
- `src/telegram.ts`: Handles Telegram bot setup and message broadcasting.
- `src/disclosures.ts`: Fetches and parses disclosures from the U.S. House Clerk’s website.
- `src/twitter.ts`: Posts new disclosures to Twitter.
- `src/chat.ts`: Manages loading and saving of subscribed chat IDs.
- `src/store.ts`: Manages loading and saving of visited document IDs.
- `src/utilts.ts`: Utility functions for date formatting.
- `src/types.ts`: Type definitions for the project.

## Usage

- **Start the bot**: The bot will start and run a cron job every minute to check for new disclosures.
- **Subscribe to updates**: Users can subscribe to updates by sending the `/start` command to the bot on Telegram.
- **Receive updates**: The bot will send new disclosure PDFs to all subscribed users and post updates to Twitter.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.