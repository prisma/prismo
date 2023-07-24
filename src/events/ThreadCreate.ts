import { Client, Events, EmbedBuilder } from "discord.js";
import { EMBED_COLOR } from "~Constants";
import { config } from "~Environment";

export default (client: Client) => {
    client.on(Events.ThreadCreate, async (thread) => {
        if (config.features.solved.channels.includes(thread.parentId ?? "")) {
            await thread.edit({
                appliedTags: [
                    config.features.solved.tags.unsolved,
                    ...thread.appliedTags.filter(t => t != config.features.solved.tags.solved && t != config.features.solved.tags.unsolved),
                ]
            });

            const embed = new EmbedBuilder()
                .setDescription(
                    `Welcome to your new thread! :wave:

                    To mark a message as a solution to your help question, right click on it and select "Apps" > "Mark as solution". This will let others know that your problem is solved and how to solve it in the future if they experience the same issue.`
                )
                .setColor(EMBED_COLOR);

            await thread.send({ embeds: [embed] });
        }
    });
};
