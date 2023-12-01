const { setTimeout } = require("timers/promises");
const { discman_database } = require("./schemas/discman");
const { discman_admin } = require("./tables/admin");
const { discman_commands_used } = require("./tables/commands_used");
const { discman_commands } = require("./tables/commands");
const { discman_giveaways } = require("./tables/giveaways");
const { discman_posts } = require("./tables/posts");
const { discman_mutes } = require("./tables/mutes");
const { discman_tickets } = require("./tables/tickets");
const { discman_wipes } = require("./tables/wipes");
const { discman_newplayers } = require("./tables/newplayers");
const { discman_votes } = require("./tables/votes");
const { discman_servers } = require("./tables/servers");
const { discman_rewardings } = require("./tables/rewardings");
const { discman_creators } = require("./tables/creators");

async function initialize() {
	const database = await discman_database().catch((err) => console.log(err));
	const table_commands = await discman_commands().catch((err) =>
		console.log(err)
	);
	const table_commands_used = await discman_commands_used().catch((err) =>
		console.log(err)
	);
	const table_posts = await discman_posts().catch((err) => console.log(err));
	const table_giveaways = await discman_giveaways().catch((err) =>
		console.log(err)
	);
	const table_mutes = await discman_mutes().catch((err) => console.log(err));
	const table_tickets = await discman_tickets().catch((err) =>
		console.log(err)
	);
	const table_wipes = await discman_wipes().catch((err) => console.log(err));
	const table_admin = await discman_admin().catch((err) => console.log(err));
	const table_newplayers = await discman_newplayers().catch((err) =>
		console.log(err)
	);
	const table_votes = await discman_votes().catch((err) => console.log(err));
	const table_servers = await discman_servers().catch((err) =>
		console.log(err)
	);
	const table_rewardings = await discman_rewardings().catch((err) =>
		console.log(err)
	);
	const table_creators = await discman_creators().catch((err) =>
		console.log(err)
	);

	function message(text, x, y) {
		if (y)
			return !x
				? console.log("\x1b[32m%s\x1b[0m", `[database][${text}] found.`)
				: console.log(
						"\x1b[33m%s\x1b[0m",
						`[database][${text}] not found. Creating one now.`
				  );
		if (x)
			return console.log(
				"\x1b[33m%s\x1b[0m",
				`[table][${text}] not found. Creating one now.`
			);
		else return console.log("\x1b[32m%s\x1b[0m", `[table][${text}] found.`);
	}
	await setTimeout(500);

	if (!database) {
		return message((text = "discman"), (x = true), (y = true));
	} else message((text = "discman"), (x = false), (y = true));
	if (!table_commands) {
		message((text = "commands"), (x = true));
	} else message((text = "commands"));
	if (!table_commands_used) {
		message((text = "commands_used"), (x = true));
	} else message((text = "commands_used"));
	if (!table_posts) {
		message((text = "posts"), (x = true));
	} else message((text = "posts"));
	if (!table_giveaways) {
		message((text = "giveaways"), (x = true));
	} else message((text = "giveaways"));
	if (!table_mutes) {
		message((text = "punishments"), (x = true));
	} else message((text = "punishments"));
	if (!table_tickets) {
		message((text = "tickets"), (x = true));
	} else message((text = "tickets"));
	if (!table_wipes) {
		message((text = "wipes"), (x = true));
	} else message((text = "wipes"));
	if (!table_admin) {
		message((text = "admin"), (x = true));
	} else message((text = "admin"));
	if (!table_newplayers) {
		message((text = "newplayers"), (x = true));
	} else message((text = "newplayers"));
	if (!table_votes) {
		message((text = "votes"), (x = true));
	} else message((text = "votes"));
	if (!table_servers) {
		message((text = "servers"), (x = true));
	} else message((text = "servers"));
	if (!table_rewardings) {
		message((text = "rewardings"), (x = true));
	} else message((text = "rewardings"));
	if (!table_creators) {
		message((text = "creators"), (x = true));
	} else message((text = "creators"));
}

module.exports = { initialize };
