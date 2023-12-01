const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	name: "settings10x",
	description: "Sends the settings10x embed",
	execute(message, client, args) {
		const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
		const embed = new EmbedBuilder()
			.setTitle("Mods & Server Settings")
			.setColor(client.config.info.embed.color)
			.setThumbnail("attachment://500x500.png")
			.addFields(
				{
					name: "Server Settings:",
					value: "🟣 farming 10x\n\n🟣 taming 10x \n\n🟣 breeding 20x\n\n🟣 turret dmg 1x \n\n🟣 blueprints vanilla \n\n🟣 xp rate 5x\n\n🟣 max dino level vanilla \n\n🟣 max player level vanilla\n\n🟣 tribe limit 5 man\n\n🟣 structure limit 100.000 per map\n\n🟣 turret limit in rang 125 \n\n🟣 turrets damage 1x\n\n🟣 turret damage offline 2.5x\n\n🟣 increased player weight\n\n🟣 balanced player stats \n\n",
				},
				{
					name: "Additional Settings",
					value: "🟣 nanny imprint til 10% \n\n🟣 crafting speed 1.5x \n\n🟣 first week of the season stryders are fully disabled \n\n🟣 first 12 hours of the season there is no PVE protection \n\n🟣 new players receive 3 days of PVE protection \n\n",
				},
				{
					name: "Beginners Server",
					value: "🟣 double xp \n\n🟣 double farming \n\n🟣 double taming \n\n🟣 no caves builds \n\n🟣 full orp \n\n🟣 wipes every week \n\n🟣 only transfer out \n\n",
				},
				{
					name: "Mods:",
					value: "https://steamcommunity.com/sharedfiles/filedetails/?id=2986170361",
				}
			)
			.setFooter({
				text: client.config.info.embed.footer,
			});

		message.channel.send({ embeds: [embed], files: [image] });
	},
};