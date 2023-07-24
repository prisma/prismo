import { ChannelType, ForumChannel, Message } from "discord.js";

export function isInForumChannel(message: Message<boolean>) {
    if(!message.channel.isThread()) return false;
    if(!message.channel.parent || message.channel.parent.type != ChannelType.GuildForum) return false;

    return true;
}