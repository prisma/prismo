import '~Setup';

import loadEnvironmentVariables from "~Environment";
import { Client, Partials } from "discord.js";
import { log } from "~Logger";
import Ready from '~events/Ready';
import InteractionCreate from '~events/InteractionCreate';
import ThreadCreate from '~events/ThreadCreate';
import ReactionAdd from '~events/ReactionAdd';

await loadEnvironmentVariables();

log("Bot is starting...", [__filename]);

const client = new Client({
    intents: ["GuildMessages", "GuildMembers", "Guilds", "MessageContent", "GuildMessageReactions", "Guilds"],
    partials: [Partials.Reaction, Partials.Message, Partials.Channel],
});

Ready(client);
InteractionCreate(client);
ThreadCreate(client);
ReactionAdd(client);

await client.login(process.env.DISCORD_TOKEN!);