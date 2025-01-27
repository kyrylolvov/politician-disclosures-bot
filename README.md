# Politician Disclosure Bot

A Telegram bot built with [Bun](https://bun.sh), TypeScript, and [Telegraf](https://github.com/telegraf/telegraf). It periodically checks new financial disclosures from the U.S. House Clerk’s website, and sends PDFs of newly published forms to all subscribed Telegram users.

## Features

- **Periodic Checks**: Uses [`node-cron`](https://www.npmjs.com/package/node-cron) to fetch new disclosures every hour from [disclosures-clerk.house.gov](https://disclosures-clerk.house.gov/).  
- **PDF Downloads**: Automatically downloads the PDF for each new filing and broadcasts it.  
- **User Subscriptions**: Telegram users just type `/start` to subscribe; the bot stores their chat ID and sends updates to them.  
- **Bun Runtime**: Utilizes Bun for speed and simplicity.  

## Requirements

- [Bun v1.1.37 or higher](https://bun.sh)  
- A valid **Telegram Bot Token** (from [@BotFather](https://t.me/BotFather))  
- Internet access to fetch ZIP files from the House Clerk’s site and to communicate with Telegram.
