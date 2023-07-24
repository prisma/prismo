import { CacheType, EmbedBuilder, ForumChannel, MessageContextMenuCommandInteraction, ThreadChannel } from "discord.js";
import { EMBED_COLOR } from "~Constants";
import { config } from "~Environment";
import { prettyArray } from "~Logger";
import { isInForumChannel } from "~Utils";

export default async function markAsSolution(
    interaction: MessageContextMenuCommandInteraction<CacheType>
) {
    await interaction.deferReply({ ephemeral: true });

    if (!isInForumChannel(interaction.targetMessage)) {
        await interaction.editReply("This message is not in a forum channel!");
        return;
    }

    const thread = interaction.targetMessage.channel as ThreadChannel<true>;
    const channel = thread.parent as ForumChannel;

    if (!config.features.solved.channels.includes(channel.id)) {
        await interaction.editReply(
            prettyArray(
                config.features.solved.channels.map((c) => `<#${c}>`),
                {
                    suffix: ".",
                    prefix: "You can only mark messages as solutions in ",
                    empty: "There are no forum channels configured!",
                    lastSeparator: " or ",
                }
            )
        );
        return;
    }

    if (thread.appliedTags.includes(config.features.solved.tags.solved)) {
        await interaction.editReply(
            "This thread is already marked as solved. Please open it to mark another message as the solution."
        );
        return;
    }

    if (thread.ownerId != interaction.user.id) {
        const pins = await thread.messages.fetchPinned();
        const crossposted = pins.find((m) => {
            return (
                m.author.id == m.client.user.id &&
                m.embeds.length == 0 &&
                m.content.includes("This post has been crossposted.")
            );
        });

        if (
            !crossposted ||
            !crossposted.content.includes(interaction.user.id)
        ) {
            await interaction.editReply(
                "You can only mark messages in your own posts as solutions!"
            );
            return;
        }
    }

    await thread.edit({
        locked: true,
        appliedTags: [
            ...thread.appliedTags.filter(
                (t) =>
                    t != config.features.solved.tags.solved &&
                    t != config.features.solved.tags.unsolved
            ),
            config.features.solved.tags.solved,
        ],
    });

    const starter = await thread.fetchStarterMessage();
    if (starter) {
        await starter.react("✅");
    }

    await interaction.deleteReply();

    const lockedEmbed = new EmbedBuilder()
        .setTitle("Marked as Solution")
        .setDescription(
            `This message has been marked as the solution to this thread by <@${interaction.user.id}>.
            If you need further assistance, click the reaction below the open the thread.`
        )
        .setFooter({
            text: "If you are having a similar issue, please open a new thread.",
        })
        .setColor(EMBED_COLOR);

    await interaction.targetMessage.pin("Marked as solution");

    const reply = await interaction.targetMessage.reply({
        embeds: [lockedEmbed],
    });

    await reply.pin();
    await reply.react("🔓");
}
