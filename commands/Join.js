const { Command } = require("discord.js-commando");
const Promo = require("../Promo");
const { ROLE_MEMBERS } = require("../constants");

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
  async run(msg, { promo }) {
    msg.delete();
    try {
      const memberRole = msg.guild.roles.find(x => x.name == ROLE_MEMBERS);
      const promoRole = msg.guild.roles.find(x => x.name == promo);
      if (!promoRole || !memberRole) return msg.reply("Roles are missings");
      await msg.member.addRoles([memberRole, promoRole]);
    } catch (e) {
      console.error(e);
      return msg.reply("An error occured during the operation");
    }

    return msg.say(`Welcome to ${promo}`).then(x => x.delete(10000));
  }
};
