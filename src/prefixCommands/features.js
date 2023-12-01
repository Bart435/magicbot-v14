const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	name: "features",
	description: "Sends the features embed",
	execute(message, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const embed = new EmbedBuilder()
			.setTitle("Additional features")
			.setDescription(
				"You can see your character information by performing the ``/playerinfo`` command within <#1098766956326297721>\nRequirements are that you must have your discord linked with ark. Referring to <#1098766743679270914>"
			)
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		message.channel.send({ embeds: [embed], files: [image] });
	},
};
