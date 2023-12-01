const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { google } = require("googleapis");

module.exports = {
	name: "test",
	description: "General testing",
	async execute(message, client, args) {
        const guid = client.guilds.cache.get("714431289180291142")
		console.log(message);
	},
};
