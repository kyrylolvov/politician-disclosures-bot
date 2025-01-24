import cron from "node-cron";

import { bot, setupBotHandlers, broadcastPdfToAll } from "./telegram";
import { loadVisitedDocIds, saveVisitedDocIds } from "./store";
import { downloadAndParseDisclosuresZip, downloadDisclosure } from "./disclosures";
import { serve } from "bun";

const API_URL = process.env.API_URL || "";

export function startDummyServer() {
  const port = Number(process.env.PORT) || 3000;

  serve({
    port,
    fetch(req) {
      if (new URL(req.url).pathname === "/ping") {
        return new Response("OK", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }
      return new Response("Hello from the politician-disclosure-bot!", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    },
  });

  cron.schedule("*/12 * * * *", async () => {
    const now = new Date().toLocaleString();
    console.log(`[CRON] Keep-alive ping at ${now}...`);

    try {
      await fetch(`${API_URL}/ping`);
      console.log("[CRON] Keep-alive ping succeeded!");
    } catch (error) {
      console.error("[CRON] Keep-alive ping failed:", error);
    }
  });

  console.log(`Dummy HTTP server running on port ${port}`);
}

/**
 * Initializes the Telegram bot, sets up cron scheduling,
 * and processes new disclosures every hour.
 */
async function main() {
  startDummyServer();

  setupBotHandlers();

  bot.launch();

  console.log("[INIT] Telegram bot launched!");

  // Schedule the job to run every minute, but only between 9 AM and 10 AM EST
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const estTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const estHour = estTime.getHours();

    if (estHour >= 9 && estHour < 10) {
      const formattedTime = estTime.toLocaleString("en-US", { timeZone: "America/New_York" });
      console.log(`[CRON] Checking disclosures at ${formattedTime}...`);

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
    }
  });

  console.log("[INIT] Cron job scheduled to run every minute between 9 AM and 10 AM EST.");
}

main().catch((err) => {
  console.error("[INIT] Failed to start:", err);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
