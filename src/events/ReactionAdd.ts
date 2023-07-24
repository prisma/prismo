import {
    ChannelType,
    Client,
    EmbedBuilder,
    Events,
    ForumChannel,
    ThreadChannel,
} from "discord.js";
import unlock from "~interactions/Unlock";

export default (client: Client) => {
    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        if (user.bot) return;

        if (await unlock(reaction, user))
            return;
    });
};
