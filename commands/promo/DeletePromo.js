const { Command } = require("discord.js-commando");

module.exports = class DeletePromo extends Command {
  constructor(client) {
    super(client, {
      name: "promo:delete",
      aliases: ["p:d"],
      group: "promo",
      memberName: "delete",
      description: "Delete a promo",
      args: [
        {
          key: "name",
          prompt: "What is the name of the promo ?",
          type: "string"
        }
      ]
    });
  }
  async run(msg, { name }) {
    msg.delete();
    try {
      const categoryChannel = msg.guild.channels.find(
        x => x.name == name && x.type == "category"
      );
      if (categoryChannel) {
        for (const channel of categoryChannel.children.values()) {
          await channel.delete();
        }
        await categoryChannel.delete();
      }
      const role = msg.guild.roles.find(x => x.name == name);
      if (role) {
        await role.delete();
      }
    } catch (e) {
      console.error(e);
      return msg.reply("An error occured during the deletion of the promo");
    }

    return msg.say(`Promo ${name} deleted`).then(x => x.delete(10000));
  }
};
