import { MessageContextMenuCommandInteraction, CacheType, ActionRowBuilder, ForumChannel, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { config } from "~Environment";

export default async function crossPostTo(interaction: MessageContextMenuCommandInteraction<CacheType>) {
    if (
        interaction.targetMessage.channel.isThread() ||
        !interaction.targetMessage.channel.isTextBased() ||
        interaction.targetMessage.channel.isDMBased()
    ) {
        await interaction.reply(
            { ephemeral: true, content: "This message is already in a thread." }
        );
        return;
    }

    if (interaction.targetMessage.author.bot) {
        await interaction.reply(
            { ephemeral: true, content: "This message was sent by a bot, so it cannot be crossposted." }
        );
        return;
    }

    const toChannelId = (
        config.features.crosspost.channels as Record<string, string>
    )[interaction.commandName.replace("Crosspost to ", "")];
    const toChannel =
        (await interaction.targetMessage.guild?.channels.fetch(
            toChannelId
        )) as ForumChannel;

    const titleInput = new TextInputBuilder()
        .setMaxLength(100)
        .setMinLength(1)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setLabel("Title")
        .setCustomId("title")
        .setValue("New Post")
        .setPlaceholder("Enter a title for the post");

    const modal = new ModalBuilder()
        .setTitle("Crosspost to #" + toChannel.name)
        .setComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                titleInput
            )
        )
        .setCustomId(
            `crosspost:${toChannel.id}:${interaction.targetMessage.id}`
        );

    await interaction.showModal(modal);
}