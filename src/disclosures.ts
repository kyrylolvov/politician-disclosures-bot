import axios from "axios";
import * as cheerio from "cheerio";
import type { ClerkDisclosure } from "./types";

/**
 * Fetches disclosures for the year 2025 using a POST request,
 * parses the HTML response, and returns the results.
 */
export async function fetchDisclosures(): Promise<ClerkDisclosure[]> {
  const url = "https://disclosures-clerk.house.gov/FinancialDisclosure/ViewMemberSearchResult";
  const formData = new URLSearchParams({ FilingYear: "2025" });

  try {
    const response = await axios.post(url, formData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const disclosures: ClerkDisclosure[] = [];
    const $ = cheerio.load(response.data);

    $("table tbody tr").each((_, row) => {
      const name = $(row).find("td.memberName a").text().trim();
      const fileUrl = $(row).find("td.memberName a").attr("href")?.trim();
      const office = $(row).find("td[data-label='Office']").text().trim();
      const filingYear = $(row).find("td[data-label='Filing Year']").text().trim();
      const filingType = $(row).find("td[data-label='Filing']").text().trim();

      const docIdMatch = fileUrl?.match(/\/(\d+)\.pdf$/);
      const documentId = docIdMatch ? docIdMatch[1] : null;

      if (!name || !fileUrl || !documentId) return;

      disclosures.push({
        name,
        office,
        filingYear,
        filingType,
        fileUrl,
        documentId,
      });
    });

    return disclosures;
  } catch (error) {
    console.error("Failed to fetch disclosures:", error);
    throw error;
  }
}

/**
 * Downloads a single disclosure PDF for the given document id
 * and returns its contents as a Buffer.
 */
export async function downloadDisclosure(documentUrl: string): Promise<Buffer> {
  try {
    const pdfUrl = `https://disclosures-clerk.house.gov/${documentUrl}`;
    const response = await axios.get<ArrayBuffer>(pdfUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } catch (err) {
    console.error("Error downloading PDF:", err);
    throw err;
  }
}
