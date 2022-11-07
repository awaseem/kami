import * as dotenv from 'dotenv';
import { App } from '@slack/bolt';

async function main() {
  dotenv.config();

  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  // The echo command simply echoes on command
  app.command('/echo', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();

    await respond(`${command.text}`);
  });

  const port = process.env.PORT ?? 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port: ${port}`);
}

main();
