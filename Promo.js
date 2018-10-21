const { PERMISSION_ALL, PERMISSION_ACCESS } = require("./constants");

const TEXT_CHANNEL_NAME = "text";
const VOICE_CHANNEL_NAME = "vocal";

module.exports = class Promo {
  constructor(guild, name) {
    this.guild = guild;
    this.name = name;
  }

  async create() {
    const role = this.getRole() || (await this.createRole());
    const category = this.getCategory() || (await this.createCategory());
    const textChannel =
      (await this.getChannel(TEXT_CHANNEL_NAME, "text")) ||
      (await this.createChannel(TEXT_CHANNEL_NAME, "text"));
    const voiceChannel =
      (await this.getChannel(VOICE_CHANNEL_NAME, "voice")) ||
      (await this.createChannel(VOICE_CHANNEL_NAME, "voice"));
  }

  getRole() {
    return this.guild.roles.find(x => x.name == this.name);
  }

  createRole() {
    return this.guild.createRole({ name: this.name });
  }

  deleteRole() {
    const role = this.getRole();
    return role.delete();
  }

  getCategory() {
    return this.guild.channels.find(
      x => x.name == this.name && x.type == "category"
    );
  }

  createCategory() {
    const role = this.getRole();
    return this.guild.createChannel(this.name, "category", [
      { denied: ["VIEW_CHANNEL"], id: this.guild.defaultRole },
      { allowed: ["VIEW_CHANNEL"], id: role }
    ]);
  }

  async deleteCategory() {
    const category = await this.getCategory();
    return category.delete();
  }

  async getChannel(name, type) {
    const category = await this.getCategory();
    return category.children.find(x => x.name == name && x.type == type);
  }

  async createChannel(name, type) {
    const category = this.getCategory();
    let channel = await this.guild.createChannel(name, type);
    channel = await channel.setParent(category);
    return await channel.lockPermissions();
  }

  async deleteChannels() {
    const category = await this.getCategory();
    const deletes = [];
    for (const channel of category.children.values()) {
      deletes.push(channel.delete());
    }
    return Promise.all(deletes);
  }
};
