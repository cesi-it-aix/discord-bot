const { Command } = require("discord.js-commando");

module.exports = class ClearChannel extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      group: "util",
      memberName: "clear",
      description: "Delete messages from a channel",
      userPermissions: ["ADMINISTRATOR"],
      args: [
        {
          key: "number",
          prompt: "How many message do you want to erase ?",
          type: "integer",
          min: 0,
          max: 500
        }
      ]
    });
  }
  async run(msg, { number }) {
    msg.delete();
    let messagesDeleted = {};
    try {
      messagesDeleted = await msg.channel.bulkDelete(number);
    } catch (e) {
      console.error(e);
      return msg.reply("An error occured during the operation");
    }

    return msg
      .say(`${messagesDeleted.size} messages deleted`)
      .then(x => x.delete(10000));
  }
};
