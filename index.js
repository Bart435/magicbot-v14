const {
	Client,
	GatewayIntentBits,
	Partials,
	Collection,
} = require("discord.js");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildInvites,
	],
	partials: [
		Partials.User,
		Partials.Message,
		Partials.GuildMember,
		Partials.ThreadMember,
	],
});

const { loadEvents } = require("./src/lib/handlers/eventHandler");
const { loadCommands } = require("./src/lib/handlers/commandHandler");
const { loadPrefixCommands } = require("./src/lib/handlers/prefixCommandHandler");
const { loadcomponents } = require("./src/lib/handlers/componentHandler");
const { initialize } = require("./src/lib/database/initialize");

client.commands = new Collection();
client.prefixCommands = new Collection();
client.components = new Collection();
client.config = require("./config.json");

require("./src/lib/systems/GiveAwaySys")(client);

["unhandledRejection", "uncaughtException", "uncaughtExceptionMonitor"].forEach(
	(str) => {
		process.on(str, console.error);
	}
);

client
	.login(client.config.secrets.discord_token)
	.then(() => {
		console.log("\x1b[34m%s\x1b[0m", "[author] bart435");
		console.log("\x1b[32m%s\x1b[0m", "[discord] connected");
		initialize();
		loadEvents(client);
		loadCommands(client);
		loadPrefixCommands(client);
		loadcomponents(client);
	})
	.catch((err) => console.log(err));
