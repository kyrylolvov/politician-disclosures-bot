import axios from "axios";
import AdmZip from "adm-zip";
import { parseStringPromise } from "xml2js";

import type { ClerkParsedXml } from "./types";

/**
 * Downloads the disclosures ZIP, extracts the 2025FD.xml file,
 * parses it as XML, and returns the result as a JavaScript object.
 */
export async function downloadAndParseDisclosuresZip(): Promise<ClerkParsedXml> {
  try {
    const zipUrl = "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/2025FD.zip";
    const response = await axios.get<ArrayBuffer>(zipUrl, { responseType: "arraybuffer" });

    const zip = new AdmZip(Buffer.from(response.data));
    const xmlEntry = zip.getEntry("2025FD.xml");
    if (!xmlEntry) {
      throw new Error("Could not find 2025FD.xml in the ZIP");
    }

    const xmlContent = xmlEntry.getData().toString("utf-8");
    const parsed = await parseStringPromise(xmlContent);
    return parsed as ClerkParsedXml;
  } catch (error) {
    console.error("Error in downloadAndParseDisclosureZip:", error);
    throw error;
  }
}

/**
 * Downloads a single disclosure PDF for the given document id
 * and returns its contents as a Buffer.
 */
export async function downloadDisclosure(docId: string): Promise<Buffer> {
  try {
    const pdfUrl = `https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2025/${docId}.pdf`;
    const response = await axios.get<ArrayBuffer>(pdfUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } catch (err) {
    console.error("Error downloading PDF:", err);
    throw err;
  }
}
