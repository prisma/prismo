import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Client,
    EmbedBuilder,
    Events,
    ForumChannel,
    MessagePayload,
    ModalBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextChannel,
    TextInputBuilder,
    TextInputStyle,
    ThreadChannel,
} from "discord.js";
import { config } from "~Environment";
import { EMBED_COLOR } from '~Constants';
import markAsSolution from "~interactions/MarkAsSolution";
import crosspostTo from "~interactions/crosspost/CrosspostTo";
import crosspostToModal from "~interactions/crosspost/CrosspostToModal";
import crosspostToTags from "~interactions/crosspost/CrosspostToTags";

export default (client: Client) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (
            interaction.isContextMenuCommand() &&
            interaction.isMessageContextMenuCommand()
        ) {

            if (interaction.commandName == "Mark as solution") {
                await markAsSolution(interaction);
                return;
            }
            
            if (
                interaction.commandName.startsWith("Crosspost to") &&
                interaction.inGuild()
            ) {
                await crosspostTo(interaction);
                return;
            }

            return;
        }
        
        if (
            interaction.isModalSubmit() &&
            interaction.customId.startsWith("crosspost:") &&
            interaction.inGuild()
        ) {
            await crosspostToModal(interaction);
            return;
        } 
        
        if (
            interaction.isStringSelectMenu() &&
            interaction.customId.startsWith("crosspost:tags:") &&
            interaction.inGuild()
        ) {
            await crosspostToTags(interaction);
            return;
        }
    });
};
