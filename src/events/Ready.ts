import {
    ApplicationCommandType,
    Client,
    ContextMenuCommandBuilder,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";
import { log } from "~Logger";
import { config } from "~Environment";

export default (client: Client) => {
    client.on("ready", async () => {
        log("Bot is ready!", [__filename]);

        const contextMenuCommand = new ContextMenuCommandBuilder()
            .setName("Mark as solution")
            .setType(ApplicationCommandType.Message);

        const guild = await client.guilds.fetch(config.general.guildId);

        const crossPostCommands = Object.keys(config.features.crosspost.channels).map((channelName) => {
            return new ContextMenuCommandBuilder()
            .setName(`Crosspost to ${channelName}`)
            .setType(ApplicationCommandType.Message)
            .setDefaultMemberPermissions(
                PermissionFlagsBits.ManageMessages
            );
        });

        await guild.commands.set([contextMenuCommand, ...crossPostCommands]);

        log("Registered context command", [__filename]);
    });
};
