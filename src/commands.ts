import { CROSS_POST_CHANNELS } from './constants';
import { ApplicationCommandType } from 'discord-api-types/v10';

const MARK_AS_SOLUTION_COMMAND = {
  name: 'Mark as solution',
  type: ApplicationCommandType.Message,
};
const CROSS_POST_COMMANDS = CROSS_POST_CHANNELS.map((channelName) => {
  return {
    name: `Crosspost to ${channelName}`,
    type: ApplicationCommandType.Message,
  };
});

export default {
  CROSS_POST_COMMANDS,
  MARK_AS_SOLUTION_COMMAND,
};
