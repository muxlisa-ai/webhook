import { blue, Bot, serve, webhookCallback } from "./deps.ts";

export const env = Deno.env.toObject();
export const bot = new Bot(env["TOKEN"] || "");
export const handle = webhookCallback(bot, "std/http");

const webhook = async () => {
  await console.log(blue("[INFO]"), `bot is starting on ${env["HOST"]}`);
  await serve(async (req) => {
    const url = new URL(req.url);

    if (req.method == "POST") {
      switch (url.pathname) {
        case "/bot":
          return await handle(req);
        default:
          return new Response("What you're trying to post?");
      }
    }

    switch (url.pathname) {
      case "/github":
        console.log(req.body);
        return new Response("Github Webhook");
      case "/telegram":
        return new Response(req.url);
      case "/webhook":
        try {
          await bot.api.setWebhook(`https://${url.hostname}/bot`);
          return new Response("Done. Set");
        } catch (_) {
          return new Response("Couldn't succeed with installing webhook");
        }
      default:
        return Response.redirect("https://t.me/xinux_changelog", 302);
    }
  });
};

await webhook();