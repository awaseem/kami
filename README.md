<p align="center">
  <img width="200px" height="200px" src="./assets/kami_no_bg.png">
</p>

<h1 align="center">Kami</h1>

<p align="center">📚 Keep your team's knowledge organized.
Slack → Notion = 💪</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg">
  <img src="https://github.com/awaseem/kami/actions/workflows/nodejs.yml/badge.svg">
  <img src="https://github.com/awaseem/kami/actions/workflows/docker.yml/badge.svg">
</p>

- [Demo](#demo)
- [Hosting your own](#hosting-your-own)
- [Getting started](#getting-started)
  - [Pre-requisites](#pre-requisites)
    - [Slack app](#slack-app)
    - [Notion app](#notion-app)
    - [Upstash](#upstash)
    - [Open AI](#open-ai)
    - [Stripe](#stripe)
    - [Final `.env` file](#final-env-file)
  - [Running the app](#running-the-app)
  - [Testing](#testing)
  - [Linting](#linting)
- [Contributing](#contributing)
- [License](#license)

# Demo

[![Kami Youtube Demo](https://img.youtube.com/vi/CVgFTT3qKcc/0.jpg)](https://www.youtube.com/watch?v=CVgFTT3qKcc)

# Hosting your own

Coming soon

# Getting started

If you'd like to run a local version similar or exactly like production, these are all the steps required.

## Pre-requisites

Kami requires a few third party services to work properly. You need to have the following accounts setup and create a `.env` file with the following variables:

### [Slack app](https://kamiplayground.slack.com/apps)

Core slack framework. You'll need the following information:

```
SLACK_APP_ID="<slack app i>"
SLACK_CLIENT_ID="<slack client id>"
SLACK_CLIENT_SECRET="<slack client secret>"
SLACK_SIGNING_SECRET="<slack sighing secret>"
SLACK_STATE_SECRET="shhh!"
```

### [Notion app](https://developers.notion.com/)

Allow integration from within Notion

```
NOTION_AUTH_URL="https://api.notion.com/v1/oauth/authorize?client_id=<NOTION_CLIENT_ID>&response_type=code&owner=user"
NOTION_OAUTH_CLIENT_ID="<NOTION_CLIENT_ID>"
NOTION_OAUTH_CLIENT_SECRET="<NOTION_OAUTH_CLIENT_SECRET>"
NOTION_REDIRECT_URL="https://<HOST_NAME>/auth/notion"
```

### [Upstash](https://upstash.com/)

Used for storing the state of the app:

```
REDIS_URL="<Upstash app url for the client: @upstash/redis>"
REDIS_TOKEN="<Upstash app password for the client: @upstash/redis>"
```

### [Open AI](https://openai.com/api/)

Used for generating AI content

```
OPEN_AI_API_KEY="<Open AI token>"
```

### [Stripe](https://stripe.com)

Used for collecting billing, you can disable this by passing `DISABLE_STRIPE_BILLING="true"`. If you want to continue with billing, provide the following:

```
STRIPE_TOKEN="<STRIPE_API_TOKEN>"
STRIPE_PRICING_ID="<STRIPE_PRICING_ID>
STRIPE_ENDPOINT_SECRET="<STRIPE_ENDPOINT_SECRET>"
```

### Final `.env` file

After all those pre-requisites accounts and secrets have been added, this is what your final `.env` file should look like:

```
SLACK_APP_ID="<slack app i>"
SLACK_CLIENT_ID="<slack client id>"
SLACK_CLIENT_SECRET="<slack client secret>"
SLACK_SIGNING_SECRET="<slack sighing secret>"
SLACK_STATE_SECRET="shhh!"

NOTION_AUTH_URL="https://api.notion.com/v1/oauth/authorize?client_id=<NOTION_CLIENT_ID>&response_type=code&owner=user"
NOTION_OAUTH_CLIENT_ID="<NOTION_CLIENT_ID>"
NOTION_OAUTH_CLIENT_SECRET="<NOTION_OAUTH_CLIENT_SECRET>"
NOTION_REDIRECT_URL="https://<HOST_NAME>/auth/notion"

REDIS_URL="<Upstash app url for the client: @upstash/redis>"
REDIS_TOKEN="<Upstash app password for the client: @upstash/redis>"

OPEN_AI_API_KEY="<Open AI token>"

# DISABLE_STRIPE_BILLING="true"
STRIPE_TOKEN="<STRIPE_API_TOKEN>"
STRIPE_PRICING_ID="<STRIPE_PRICING_ID>
STRIPE_ENDPOINT_SECRET="<STRIPE_ENDPOINT_SECRET>"
```

## Running the app

To run the app, just use the following command:

```
npm run dev
```

You'll also need to forward your localhost by either using [ngrok](https://ngrok.com/) or [cloudflare tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/)

## Testing

To run tests, simply run the following command:

```
npm run test
```

## Linting

Check if your code is up to the linting standard, run the following command:

```
npm run lint
```

# Contributing

Kami is an open source project, and contributions of any kind are welcome and appreciated. Open issues, bugs, and feature requests are all listed on the issues tab and labeled accordingly. Feel free to open bug tickets and make feature requests. Please follow these small rules to ensure everything can produced smoothly, can't wait to see your work!

- When submitting work, please ensure to create a pull request with pictures or videos showcasing the changes to the app (if any visual changes).
- Ensure the app runs and all linting standards are applied

Have fun and don't be afraid to reach out for any questions or concerns.

# License

This project is open source and available under the [MIT License.](https://github.com/awaseem/kami/blob/main/LICENSE)
