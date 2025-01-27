import cron from "node-cron";

import { bot, setupBotHandlers, broadcastPdfToAll } from "./telegram";
import { loadVisitedDocIds, saveVisitedDocIds } from "./store";
import { fetchDisclosures, downloadDisclosure } from "./disclosures";
import { postToTwitter } from "./twitter";

/**
 * Processes and broadcasts new disclosures periodically.
 */
async function processDisclosures() {
  const visitedDocIds = loadVisitedDocIds();

  try {
    const disclosures = await fetchDisclosures();
    console.log("[DEBUG] Total disclosures fetched:", disclosures.length);

    for (const disclosure of disclosures) {
      if (visitedDocIds.includes(disclosure.documentId)) continue;

      visitedDocIds.push(disclosure.documentId);

      try {
        const pdfBuffer = await downloadDisclosure(disclosure.fileUrl);
        await broadcastPdfToAll(disclosure, pdfBuffer);
        await postToTwitter(disclosure);
      } catch (err) {
        console.error(`Error handling disclosure for ${disclosure.name}:`, err);
      }
    }

    saveVisitedDocIds(visitedDocIds);
  } catch (error) {
    console.error("Error processing disclosures:", error);
  }
}

/**
 * Initializes the Telegram bot, sets up cron scheduling,
 * and processes disclosures every 15 minutes.
 */
async function main() {
  setupBotHandlers();
  bot.launch();

  console.log("[INIT] Telegram bot launched!");

  cron.schedule("* * * * *", async () => {
    const now = new Date().toLocaleString();

    console.log(`[CRON] Running disclosure check at ${now}...`);

    await processDisclosures();
  });

  console.log("[INIT] Cron job scheduled to run every minute.");
}

main().catch((err) => {
  console.error("[INIT] Failed to start:", err);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
