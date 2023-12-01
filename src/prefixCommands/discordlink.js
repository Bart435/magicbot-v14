const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	name: "discordlink",
	description: "Sends the discordlink embed",
	execute(message, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const embed = new EmbedBuilder()
			.setTitle("Linking system")
			.setDescription(
				"Linking your discord can be done by performing ``/verify`` within <#1098766956326297721>. This will return with a command that needs to be executed on 1 of our servers. Linking your discord with ark allows for faster help in tickets, Receive more points hourly, Being able to kick yourself from the server and for automatic donator role appliance.\n\nTo enable raidwarning use ``/raidwarning 15`` on any of the servers to receive a DM from our discord bot whenever you're under attack.\n\nQuick [tutorial](https://www.youtube.com/watch?v=5s3BN6BTt5Q) if your still need help. "
			)
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		message.channel.send({ embeds: [embed], files: [image] });
	},
};
