const { Command } = require("discord.js-commando");
const Promo = require("../Promo");

module.exports = class Clear extends Command {
  constructor(client) {
    super(client, {
      name: "join",
      group: "commands",
      memberName: "join",
      description: "Join a promo",
      args: [
        {
          key: "promo",
          prompt: "What is the name of the promo ?",
          type: "string"
        }
      ]
    });
  }
  async run(msg, { promo: name }) {
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
