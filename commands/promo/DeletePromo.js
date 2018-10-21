const { Command } = require("discord.js-commando");
const Promo = require("../../Promo");

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
    const promo = new Promo(msg.guild, name);
    try {
      const categoryChannel = await promo.getCategory();
      if (categoryChannel) {
        await promo.deleteChannels();
        await promo.deleteCategory();
      }
      const role = promo.getRole();
      if (role) await role.delete();
    } catch (e) {
      console.error(e);
      return msg.reply("An error occured during the deletion of the promo");
    }

    return msg.say(`Promo ${name} deleted`).then(x => x.delete(10000));
  }
};
