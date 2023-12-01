const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'vote',
	customID: 'vote',
	description: 'returns vote embed',
	execute(interaction, client) {
        let embed = new EmbedBuilder().setColor(client.config.info.embed.color)
        const servers = client.config.servers
        if (interaction.channel.parent.id == client.config.info.basicCategory) {
            for (let i = 0; i < servers["10x"].length; i++) {
                embed.addFields({ name: `${servers["10x"][i].name}`, value: `${servers["10x"][i].voteUrl}` })
            }
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        if (interaction.channel.parent.id == client.config.info.boostedCategory) {
            for (let i = 0; i < servers["100x"].length; i++) {
                embed.addFields({ name: `${servers["100x"][i].name}`, value: `${servers["100x"][i].voteUrl}` })
            }
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
    	
	},
};