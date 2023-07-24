import {
    ActionRowBuilder,
    CacheType,
    EmbedBuilder,
    ForumChannel,
    ModalSubmitInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import { config } from "~Environment";
import { EMBED_COLOR } from "~Constants";

export default async function crosspostToModal(
    interaction: ModalSubmitInteraction<CacheType>
) {
    await interaction.deferReply({ ephemeral: true });
    const [toChannelId, messageId] = interaction.customId.slice(10).split(":");

    const guild = await interaction.guild?.fetch();
    const channel = await interaction.channel?.fetch();

    if (!guild || !channel) {
        await interaction.editReply(
            "An error occurred while fetching the guild."
        );
        return;
    }

    const toChannel = (await guild.channels.fetch(toChannelId)) as ForumChannel;

    const tags = toChannel.availableTags;

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`crosspost:tags:${toChannel.id}:${messageId}`)
        .setPlaceholder("Select tags to apply to the post")
        .setMinValues(1)
        .setMaxValues(tags.length - 2)
        .addOptions(
            ...tags
                .filter(
                    (tag) =>
                        tag.id != config.features.solved.tags.solved &&
                        tag.id != config.features.solved.tags.unsolved
                )
                .map((t) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(t.name)
                        .setValue(t.id);
                })
        );

    const embed = new EmbedBuilder()
        .setTitle("Crosspost to #" + toChannel.name)
        .setDescription(
            "Step 2. Select the tags you want to apply to the post."
        )
        .addFields({
            name: "Title",
            value: interaction.fields.getTextInputValue("title"),
        })
        .setColor(EMBED_COLOR);

    await interaction.editReply({
        embeds: [embed],
        components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                selectMenu
            ),
        ],
    });
}
