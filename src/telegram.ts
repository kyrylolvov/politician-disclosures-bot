import { Telegraf } from "telegraf";
import { loadChatIds, saveChatIds } from "./chat";
import type { ClerkMember } from "./types";

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
export async function broadcastPdfToAll(member: ClerkMember, pdfBuffer: Buffer) {
  const docId = member.DocID?.[0] ?? "";
  const firstName = member.First?.[0] ?? "";
  const lastName = member.Last?.[0] ?? "";

  const suffix = member.Suffix?.[0] ?? "";
  const prefix = member.Prefix?.[0] ?? "";

  const fullName = `${prefix} ${firstName} ${lastName} ${suffix}`.replace(/\s+/g, " ").trim();

  for (const chatId of knownChatIds) {
    try {
      await bot.telegram.sendDocument(
        chatId,
        { source: pdfBuffer, filename: `${docId}.pdf` },
        { caption: `New disclosure for ${fullName}` }
      );
      console.log(`PDF sent to chat id ${chatId} for docId = ${docId}`);
    } catch (err) {
      console.error(`Error sending PDF to chatId ${chatId}:`, err);
    }
  }
}
