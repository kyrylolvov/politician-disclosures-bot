import fs from "fs";
import path from "path";

const CHATS_FILE = path.join(process.cwd(), "chats.json");

/**
 * Loads all subscribed chat IDs from chats.json.
 * If the file doesn't exist, returns an empty list.
 */
export function loadChatIds(): number[] {
  if (!fs.existsSync(CHATS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(CHATS_FILE, "utf-8");
    return JSON.parse(data) as number[];
  } catch (err) {
    console.error("Failed to load chat IDs:", err);
    return [];
  }
}

/**
 * Saves an array of chat IDs to chats.json.
 */
export function saveChatIds(chatIds: number[]): void {
  try {
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chatIds, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save chat IDs:", err);
  }
}
