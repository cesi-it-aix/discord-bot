const { Command } = require("discord.js-commando");
const Promo = require("../../Promo");

const TEXT_CHANNEL_NAME = "text";
const VOICE_CHANNEL_NAME = "vocal";

module.exports = class CreatePromo extends Command {
  constructor(client) {
    super(client, {
      name: "promo:create",
      aliases: ["p:c"],
      group: "promo",
      memberName: "create",
      description: "Create a promo",
      userPermissions: ["ADMINISTRATOR"],
      hidden: true,
      guildOnly: true,
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
    let response = "";
    try {
      let role = promo.getRole();
      if (role) {
        response += `Role ${name} already exists\n`;
      } else {
        role = await promo.createRole();
        response += `Role ${name} created\n`;
      }

      let categoryChannel = promo.getCategory();
      let textChannel, vocalChannel;
      if (categoryChannel) {
        response += `Category ${name} already exists\n`;
        textChannel = promo.getChannel(TEXT_CHANNEL_NAME, "text");
        vocalChannel = promo.getChannel(VOICE_CHANNEL_NAME, "voice");
      } else {
        categoryChannel = await promo.createCategory();
        response += `Category ${name} created\n`;
      }

      if (textChannel) {
        response += `Channel ${TEXT_CHANNEL_NAME} already exists\n`;
      } else {
        textChannel = await promo.createChannel(TEXT_CHANNEL_NAME, "text");
        response += `Channel ${TEXT_CHANNEL_NAME} created\n`;
      }

      if (vocalChannel) {
        response += `Channel ${VOICE_CHANNEL_NAME} already exists\n`;
      } else {
        vocalChannel = await await promo.createChannel(
          VOICE_CHANNEL_NAME,
          "voice"
        );
        response += `Channel ${VOICE_CHANNEL_NAME} created\n`;
      }
    } catch (e) {
      console.error(e);
      return msg.reply("An error occured during the creation of the promo");
    }

    return msg.say(response).then(x => x.delete(10000));
  }
};
