import { Telegraf } from "telegraf";
import { loadChatIds, saveChatIds } from "./chat";
import type { ClerkDisclosure } from "./types";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
export const bot = new Telegraf(BOT_TOKEN);

let knownChatIds = loadChatIds();

/**
 * Sets up basic bot command handlers, such as the /start command.
 */
export function setupBotHandlers() {
  bot.start((ctx) => {
    ctx.reply("Hello! You will now receive new disclosures.");
    const chatId = ctx.chat.id;

    if (!knownChatIds.includes(chatId)) {
      knownChatIds.push(chatId);
      saveChatIds(knownChatIds);
    }
  });
}

/**
 * Sends a PDF buffer to all known chat IDs for the given clerk member.
 */
export async function broadcastPdfToAll(member: ClerkDisclosure, pdfBuffer: Buffer) {
  for (const chatId of knownChatIds) {
    try {
      await bot.telegram.sendDocument(
        chatId,
        { source: pdfBuffer, filename: `${member.documentId}.pdf` },
        { caption: `New disclosure for ${member.name}` }
      );
      console.log(`PDF sent to chat id ${chatId} for docId = ${member.documentId}`);
    } catch (err) {
      console.error(`Error sending PDF to chatId ${chatId}:`, err);
    }
  }
}
