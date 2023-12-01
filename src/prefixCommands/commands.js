const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	name: "commands",
	description: "Sends the commands embed",
	execute(message, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const embed = new EmbedBuilder()
			.setTitle("Commands")
			.setDescription(
				"Both ingame commands and discord commands will be covered within this message."
			)
			.setFields({
				name: "Ingame Commands",
				value: "``/fill`` - Fills all turrets in range.\n``/turrets`` - Brings up a list of commands you can use to control turret settings.\n``/bodies`` - Brings up a list with all your deathbags.\n``/getbody *BagNumber*`` - This will retrieve your corpse by bagNumber.\n``/pvp 1 *on/off*`` - Enables or disables damage digits.\n``/showlimits`` - Will show you current status of your structure limits.\n``/achievements`` - Shows your all time achievements.\n``/dachievements`` - Shows your daily achievements.\n``/suicide`` - Self explanatory.\n``/disablepve`` - Disables your temporarily pve time.\n\nFull commands explanations on our [steamgroup](https://steamcommunity.com/groups/MagicArk/discussions/0/3829789016665607117/)",
			})
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.setFooter({
				text: client.config.info.embed.footer,
			});

		message.channel.send({ embeds: [embed], files: [image] });
	},
};
