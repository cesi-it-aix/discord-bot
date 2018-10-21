const { PERMISSION_ALL, PERMISSION_ACCESS } = require("./constants");

module.exports = class Promo {
  constructor(guild, name) {
    this.guild = guild;
    this.name = name;
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
      { denied: PERMISSION_ALL, id: this.guild.defaultRole },
      { allowed: PERMISSION_ACCESS, id: role }
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
    const channel = await this.guild.createChannel(name, type);
    return await channel.setParent(category);
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
