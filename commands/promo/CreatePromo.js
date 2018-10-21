const { Command } = require("discord.js-commando");
const { PERMISSION_ALL, PERMISSION_ACCESS } = require("../../constants");

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
    let response = "";
    try {
      let role = msg.guild.roles.find(x => x.name == name);
      if (role) {
        response += `Role ${name} already exists\n`;
      } else {
        role = await msg.guild.createRole({ name });
        response += `Role ${name} created\n`;
      }

      let categoryChannel = msg.guild.channels.find(
        x => x.name == name && x.type == "category"
      );
      let textChannel, vocalChannel;
      if (categoryChannel) {
        response += `Category ${name} already exists\n`;
        textChannel = categoryChannel.children.find(
          x => x.name == "text" && x.type == "text"
        );
        vocalChannel = categoryChannel.children.find(
          x => x.name == "vocal" && x.type == "voice"
        );
      } else {
        categoryChannel = await msg.guild.createChannel(name, "category", [
          { denied: PERMISSION_ALL, id: msg.guild.defaultRole },
          { allowed: PERMISSION_ACCESS, id: role }
        ]);
        response += `Category ${name} created\n`;
      }

      if (textChannel) {
        response += `Channel ${TEXT_CHANNEL_NAME} already exists\n`;
      } else {
        textChannel = await msg.guild.createChannel(TEXT_CHANNEL_NAME, "text");
        await textChannel.setParent(categoryChannel);
        response += `Channel ${TEXT_CHANNEL_NAME} created\n`;
      }

      if (vocalChannel) {
        response += `Channel ${VOICE_CHANNEL_NAME} already exists\n`;
      } else {
        vocalChannel = await msg.guild.createChannel(
          VOICE_CHANNEL_NAME,
          "voice"
        );
        await vocalChannel.setParent(categoryChannel);
        response += `Channel ${VOICE_CHANNEL_NAME} created\n`;
      }
    } catch (e) {
      console.error(e);
      return msg.reply("An error occured during the creation of the promo");
    }

    return msg.say(response).then(x => x.delete(10000));
  }
};
