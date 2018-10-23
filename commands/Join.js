const { Command } = require("discord.js-commando");
const Promo = require("../Promo");
const { ROLE_MEMBERS } = require("../constants");
const { deleteAfter } = require("../utils");
const PromosData = require("../promos.json");

const promos = PromosData.map(x => x.name);

module.exports = class Clear extends Command {
  constructor(client) {
    super(client, {
      name: "join",
      group: "commands",
      memberName: "join",
      description: "Join a promo",
      guildOnly: true,
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
    try {
      msg.delete();

      const isMember = msg.member.roles.some(x => x.name == ROLE_MEMBERS);
      if (isMember) return;

      const promoNames = [promo, promo.toUpperCase(), promo.toLowerCase()];
      const promoName = promos.find(x => promoNames.includes(x));
      if (!promoName)
        return msg.reply("Promo not valid").then(deleteAfter(10000));

      const memberRole = msg.guild.roles.find(x => x.name == ROLE_MEMBERS);
      const promoRole = msg.guild.roles.find(x => x.name == promoName);

      if (!memberRole) return;
      if (!promoRole)
        return msg.reply("Promo not found").then(deleteAfter(10000));

      await msg.member.addRoles([memberRole, promoRole]);
    } catch (e) {
      console.error(e);
      return msg
        .reply("An error occured during the operation")
        .then(deleteAfter(10000));
    }
  }
};
