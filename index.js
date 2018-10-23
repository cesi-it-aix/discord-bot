const config = require("dotenv").config();
const Commando = require("discord.js-commando");
const path = require("path");
const chalk = require("chalk");
const http = require("http");

const Promo = require("./Promo");
const PromosData = require("./promos.json");

const CreatePromo = require("./commands/promo/CreatePromo");
const DeletePromo = require("./commands/promo/DeletePromo");
const ClearChannel = require("./commands/utils/ClearChannel");
const Join = require("./commands/Join");

const client = new Commando.CommandoClient();

console.log("Starting");

client.on("ready", () => {
  console.log(chalk.green("Ready"));
  client.guilds.forEach(guild => {
    const promos = PromosData.map(({ name }) => new Promo(guild, name));
    promos.forEach(promo => {
      promo.create();
    });
  });
});

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
  .registerGroups([["promo", "Manage promos"]])
  // .registerDefaultCommands()
  .registerCommands([CreatePromo, DeletePromo, ClearChannel, Join]);
// .registerCommandsIn(path.join(__dirname, "commands")) Not Working ?

client.login(process.env.TOKEN);

const httpServer = http.createServer((req, res) => res.end("Hello World"));
httpServer.listen(process.env.PORT || 3000);
