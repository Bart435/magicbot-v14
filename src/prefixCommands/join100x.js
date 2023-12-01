const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");

module.exports = {
	name: "join100x",
	description: "Send join embed!",
	execute(message, client, args) {
		const servers = client.config.servers["100x"];
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const embed = new EmbedBuilder()
			.setTitle("MagicArk 100x join details")
			.setDescription("All IP's, join buttons & Server add tutorial:")
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		for (let i = 0; i < servers.length; i++) {
			if (!servers[i].enabled) continue;
			embed.addFields({
				name: `${servers[i].name}`,
				value: `**ip:** ${servers[i].ip}:${servers[i].queryPort}\n└ [connect](${servers[i].url})`,
			});
		}

		embed.addFields({
			name: "‎‎‏",
			value: "A server can be joined by clicking connect under each map.\n\nIf you don't know how to add a server to your steam favorites, click here to watch the [tutorial](https://www.youtube.com/watch?v=xepOu9-d5GQ) we made for you.",
		});

		message.channel.send({ embeds: [embed], files: [image] });
	},
};
