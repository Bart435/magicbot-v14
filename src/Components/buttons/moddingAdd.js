const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'moddingAdd',
	customID: 'moddingAdd',
	description: 'adds role',
	async execute(interaction, client) {
        const sucEm = new EmbedBuilder().setColor("Green")
        const errEm =  new EmbedBuilder().setColor("Red")
        
        try {
            const guild = client.guilds.cache.get(client.config.info.mainGuild)
            guild.members.fetch(interaction.user.id).then(member => {
                if (member.roles.cache.has("1118181130886189108")) return interaction.reply({ embeds: [errEm.setDescription("You already have this role")], ephemeral: true })
                member.roles.add("1118181130886189108")
                interaction.reply({ embeds: [sucEm.setDescription("Your role has succesfully been added")], ephemeral: true })
            })
        } catch (error) { 
            console.log(error)
        }
	},
}
