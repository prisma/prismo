import type {
  APIApplicationCommandInteraction,
  APIPingInteraction,
  APIThreadChannel,
} from 'discord-api-types/v10';
import { InteractionResponseType, InteractionType } from 'discord-api-types/v10';
import { PlatformAlgorithm, isValidRequest } from 'discord-verify/web';

import DISCORD_COMMANDS from './commands';
import { createJsonResponse, editInteractionResponse, sendInteractionResponse } from './utils';

export interface Env {
  DISCORD_TOKEN?: string; // The token generated for your bot while creating a discord application
  DISCORD_PUBLIC_KEY?: string; // Public key of your Discord bot helps to verify the bot and apply interaction url
  DISCORD_APPLICATION_ID?: string; // The application id of your bot.
  DISCORD_GUILD_ID?: string; // Id of the guild where you want to install the slash commands.
}

const CROSSPOST_COMMANDS = DISCORD_COMMANDS.CROSS_POST_COMMANDS.map((command) =>
  command.name.toLocaleLowerCase(),
);
const SOLUTION_COMMAND = DISCORD_COMMANDS.MARK_AS_SOLUTION_COMMAND.name.toLocaleLowerCase();

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const isValid = await isValidRequest(
      request,
      env.DISCORD_PUBLIC_KEY ?? '',
      PlatformAlgorithm.Cloudflare,
    );

    if (!isValid) {
      return createJsonResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    const interaction: APIPingInteraction | APIApplicationCommandInteraction = await request.json();

    if (interaction.type === InteractionType.Ping) {
      return createJsonResponse({
        type: InteractionResponseType.Pong,
      });
    }

    console.log('channel:', interaction.channel);
    console.log('data:', interaction.data);

    if (interaction.type === InteractionType.ApplicationCommand) {
      const messageCommand = interaction.data.name.toLocaleLowerCase();
      console.log('received command: ', messageCommand);
      if (CROSSPOST_COMMANDS.includes(messageCommand)) {
        console.log('we should crosspost this.');
        // move the message to a new channel
        // let user know what we did
        // delete the old message
      } else if (messageCommand === SOLUTION_COMMAND) {
        ctx.waitUntil(
          new Promise((_) => {
            if (!interaction.message?.thread) {
              await editInteractionResponse(interaction.id, interaction.token, {
                content: 'This command can only be used in a thread.',
                flags: 64,
              });
              return createJsonResponse({ status: 200 });
            }
            return createJsonResponse({
              type: InteractionResponseType.DeferredChannelMessageWithSource,
              flags: 64,
            });
          }),
        );
      }
    }
    return createJsonResponse({ error: 'Unexpected error' }, { status: 500 });
  },
};
