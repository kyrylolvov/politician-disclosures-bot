import fs from "fs";
import path from "path";

const VISITED_JSON = path.join(process.cwd(), "visited.json");

/**
 * Loads all visited doc ids from visited.json (an array of strings).
 * If the file doesn't exist, returns an empty array.
 */
export function loadVisitedDocIds(): string[] {
  if (!fs.existsSync(VISITED_JSON)) {
    return [];
  }
  try {
    const data = fs.readFileSync(VISITED_JSON, "utf-8");
    return JSON.parse(data) as string[];
  } catch (error) {
    console.error("Error reading visited.json:", error);
    return [];
  }
}

/**
 * Saves the provided array of doc ids to visited.json.
 */
export function saveVisitedDocIds(docIds: string[]) {
  try {
    fs.writeFileSync(VISITED_JSON, JSON.stringify(docIds, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving visited.json:", error);
  }
}
