import { TwitterApi } from "twitter-api-v2";
import type { ClerkDisclosure } from "./types";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

/**
 * Posts a new disclosure to Twitter.
 */
async function postToTwitter(disclosure: ClerkDisclosure) {
  try {
    const tweetText = `ALERT: New Disclosure Released for ${disclosure.name}\n\nView Here: https://disclosures-clerk.house.gov/${disclosure.fileUrl}`;
    const tweet = await twitterClient.v2.tweet(tweetText);

    console.log(`[Twitter] Tweet posted successfully: ${tweet.data.id}`);
  } catch (error) {
    console.error("[Twitter] Error posting tweet:", error);
  }
}

export { postToTwitter };
