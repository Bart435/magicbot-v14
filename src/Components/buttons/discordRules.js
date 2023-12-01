const { EmbedBuilder } = require("discord.js");
module.exports = {
	name: 'discordRules',
	customID: 'Discord Rules',
	description: 'returns discord rules embed',
	execute(interaction, client) {
		const disembed = new EmbedBuilder()
		.setColor(client.config.info.embed.color)
		.setDescription("Just like all other community servers there are rules that need be enforced. For both your and our safety. Discord expects us as 'Community' to adhere to their guidelines. So we want all of you to follow our rules the best you can. To improve everyone’s play experience as well as to feel safe in both the discord and in our ark servers. Thank you.")
		.addFields(
			{ name: '**Discord Rules: **', value: "Because you are taking part of this discord community, we expect you to behave yourself. We also expect you to use common sense and follow both Discord TOS and community guidelines. Constantly harassing someone can result in punishments. Punishments will always be at staff’s discretion. Discord TOS & community guidelines can be found by the following links (https://discord.com/terms) (https://discord.com/guidelines)" },
			);

    	interaction.reply({ embeds: [disembed], ephemeral: true })
	},
};