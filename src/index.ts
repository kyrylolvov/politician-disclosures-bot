import cron from "node-cron";

import { bot, setupBotHandlers, broadcastPdfToAll } from "./telegram";
import { loadVisitedDocIds, saveVisitedDocIds } from "./store";
import { downloadAndParseDisclosuresZip, downloadDisclosure } from "./disclosures";
import { serve } from "bun";

/**
 * Initializes the Telegram bot, sets up cron scheduling,
 * and processes new disclosures every hour.
 */
async function main() {
  setupBotHandlers();

  bot.launch();

  console.log("[INIT] Telegram bot launched!");

  cron.schedule("* * * * *", async () => {
    const now = new Date().toLocaleString(); // or you could use other date/time formats
    console.log(`[CRON] Checking disclosures at ${now}...`);

    const visitedDocIds = loadVisitedDocIds();

    const disclosures = await downloadAndParseDisclosuresZip();
    const members = disclosures?.FinancialDisclosure?.Member || [];

    console.log("[DEBUG] Total members in XML:", members.length);

    for (const member of members) {
      const filingType = member.FilingType?.[0];
      if (filingType !== "P") continue;

      const docId = member.DocID?.[0];
      if (!docId) continue;

      if (!visitedDocIds.includes(docId)) {
        visitedDocIds.push(docId);

        try {
          const pdfBuffer = await downloadDisclosure(docId);
          await broadcastPdfToAll(member, pdfBuffer);
        } catch (err) {
          console.error(`Error handling docId ${docId}:`, err);
        }
      }
    }

    saveVisitedDocIds(visitedDocIds);
  });

  console.log("[INIT] Cron job scheduled to run every 15 minutes.");
}

main().catch((err) => {
  console.error("[INIT] Failed to start:", err);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
