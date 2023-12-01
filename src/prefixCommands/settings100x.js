const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	name: "settings100x",
	description: "Sends the settings100x embed",
	execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const embed = new EmbedBuilder()
			.setTitle("Mods & Server Settings")
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.addFields(
				{
					name: "Server Settings:",
					value: "🟢 PvP settings which allow faster gameplay\n\n🟢 x100 Farm Rates\n\n🟢 Max Player level 300 (instant levels)\n\n🟢 All engrams including tek are unlocked as you level\n\n🟢 Max Dino level 300 wild (tek, rock drake and wyvern can be higher)\n\n🟢 Instant tame and instant levels (you get 100 levels after tame)\n\n🟢 Cave damage 2x\n\n🟢 Turret damage 4x (increases to 5x with ORP)\n\n🟢 Cannon raid disabled\n\n🟢 Maturations and egg hatch times are 200x\n\n🟢 Mutations x4 stack\n\n🟢 4 man tribes maximum\n\n🟢 Alliances are allowed however Alliance is disabled ingame\n\n🟢 Structure/build limit is 25000 objects total\n\n🟢 Buffed drops and beacons\n\n🟢 Titan taming is disabled",
				},
				{
					name: "Mods:",
					value: "https://steamcommunity.com/sharedfiles/filedetails/?id=2870396732",
				}
			)
			.setFooter({
				text: client.config.info.embed.footer,
			});

		message.channel.send({ embeds: [embed], files: [image] });
	},
};
