import {
    MessageReaction,
    PartialMessageReaction,
    User,
    PartialUser,
    ForumChannel,
    ThreadChannel,
    EmbedBuilder,
} from "discord.js";
import { EMBED_COLOR } from "~Constants";
import { config } from "~Environment";
import { isInForumChannel } from "~Utils";

export default async function unlock(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) {
    if (reaction.emoji.name != "🔓") return false;

    const message = await reaction.message.fetch();

    if (!isInForumChannel(message)) {
        return false;
    }

    const thread = (await message.channel.fetch()) as ThreadChannel<true>;
    const channel = thread.parent as ForumChannel;

    if (!config.features.solved.channels.includes(thread.parentId ?? ""))
        return false;

    const member = await channel.guild.members.fetch(user.id);

    if (
        thread.ownerId != user.id &&
        !member.permissions.has("ManageThreads")
    )
    {
        const pins = await thread.messages.fetchPinned();
                const crossposted = pins.find((m) => {
                    return (m.author.id == m.client.user.id && m.embeds.length == 0 && m.content.includes("This post has been crossposted."))
                });

        if (!crossposted || !crossposted.content.includes(user.id))
            return false;
    }

    if (message.author.id != message.author.client.user.id) return false;

    if (
        message.embeds.length == 0 ||
        message.embeds[0].title != "Marked as Solution"
    )
        return;


    if (!thread.locked) return;

    await thread.edit({
        locked: false,
        appliedTags: [
            ...thread.appliedTags.filter(
                (t) =>
                    t != config.features.solved.tags.solved &&
                    t != config.features.solved.tags.unsolved
            ),
            config.features.solved.tags.unsolved,
        ],
    });

    await message.delete();

    const pins = await thread.messages.fetchPinned();
    await Promise.all(pins.filter(m => {
        return !(m.author.id == m.client.user.id && m.embeds.length == 0 && m.content.includes("This post has been crossposted."))
    }).map(async (m) => await m.unpin()));

    const resultEmbed = new EmbedBuilder()
        .setTitle("Thread Unlocked")
        .setDescription(
            `This thread has been unlocked by <@${user.id}>.`
        )
        .setColor(EMBED_COLOR);

    await thread.send({
        embeds: [resultEmbed],
    });

    const starter = await thread.fetchStarterMessage();
    if (starter && starter.id != message.id) {
        await starter.reactions.removeAll();
    }

    return true;
}
