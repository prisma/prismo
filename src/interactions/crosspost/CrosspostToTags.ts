import {
    StringSelectMenuInteraction,
    CacheType,
    TextChannel,
    ForumChannel,
} from "discord.js";

export default async function crosspostToTags(
    interaction: StringSelectMenuInteraction<CacheType>
) {
    await interaction.deferUpdate();
    const [toChannelId, messageId] = interaction.customId.slice(15).split(":");

    const guild = await interaction.guild?.fetch();
    const channel = (await interaction.channel?.fetch()) as TextChannel;

    const toChannel = (await guild?.channels.fetch(
        toChannelId
    )) as ForumChannel;

    const tags = interaction.values;

    const message = await channel.messages.fetch(messageId);
    const content = message.content;

    const previousReply = await interaction.fetchReply();
    const embed = previousReply.embeds[0];

    const title = embed.fields[0].value;

    const thread = await toChannel.threads.create({
        name: title,
        message: { content },
        appliedTags: tags,
    });
    await channel.messages.delete(messageId);
    const posted = await thread.send({
        content: `This post has been crossposted.\n- **From:** <#${channel.id}>\n- **For:** <@${message.author.id}>`,
    });
    await posted.pin();
    await interaction.editReply({
        content: `Successfully crossposted to <#${thread.id}>.`,
        embeds: [],
        components: [],
    });

    try {
        const privateChannel = await message.author.createDM(true);
        await privateChannel.send({
            content: `Your message has been moved from <#${channel.id}> to <#${toChannelId}>. Find it here: ${thread.url}.`,
        });
    } catch {
        // ignore error, user might have their DMs closed
    }
}
