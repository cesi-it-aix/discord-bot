const { Command } = require("discord.js-commando");

module.exports = class CreatePromo extends Command {
  constructor(client) {
    super(client, {
      name: "promo",
      group: "commands",
      memberName: "promo",
      description: "Manage Promo",
      args: [
        {
          key: "action",
          prompt: "What action would you like to do ?",
          type: "string",
          oneOf: ["create", "delete"]
        },
        {
          key: "name",
          prompt: "What is the name of the promo ?",
          type: "string"
        }
      ]
    });
  }
  async run(msg, { action, name }) {
    const guild = this.client.guilds.first();
    if (action == "create") {
      const role = await guild.createRole({
        name
      });
      const categoryChannel = await guild.createChannel(name, "category", [
        { denied: 2146958847, id: guild.defaultRole },
        { allowed: 37215296, id: role }
      ]);
      await Promise.all(
        (async () => {
          const textChannel = await guild.createChannel("text", "text");
          await textChannel.setParent(categoryChannel);
        })(),
        (async () => {
          const vocalChannel = await guild.createChannel("vocal", "voice");
          await vocalChannel.setParent(categoryChannel);
        })()
      );
    }

    if (action == "delete") {
      const categoryChannel = guild.channels.find(x => x.name == name);
      if (categoryChannel) {
        for (const channel of categoryChannel.children.values()) {
          await channel.delete();
        }
        await categoryChannel.delete();
      }
      const role = guild.roles.find(x => x.name == name);
      if (role) {
        await role.delete();
      }
    }
    return msg.say(`You want to ${action} promo ${name}`);
  }
};
