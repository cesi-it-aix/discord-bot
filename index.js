const config = require("dotenv").config();
const Commando = require("discord.js-commando");
const path = require("path");
const chalk = require("chalk");

const CreatePromo = require("./commands/CreatePromo");

const client = new Commando.CommandoClient();

console.log("Starting");

client.on("ready", () => console.log(chalk.green("Ready")));

client.on("commandRegister", command =>
  console.log(
    `Command ${chalk.blue(`${command.groupID}:${command.name}`)} registered`
  )
);

client.on("groupRegister", group =>
  console.log(`Group ${chalk.blue(group.id)} registered`)
);

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommands([CreatePromo]);
// .registerCommandsIn(path.join(__dirname, "commands")) Not Working ?

client.login(process.env.TOKEN);
