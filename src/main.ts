import * as dotenv from 'dotenv';
import { App } from '@slack/bolt';

async function main() {
  dotenv.config();

  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
}

main();
