const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'basicRemove',
	customID: 'basicRemove',
	description: 'Removes role',
	async execute(interaction, client) {
        const sucEm = new EmbedBuilder().setColor("Green")
        const errEm =  new EmbedBuilder().setColor("Red")

        try {
            const guild = client.guilds.cache.get(client.config.info.mainGuild)
            guild.members.fetch(interaction.user.id).then(member => {
                if (!member.roles.cache.has("1116625591949606964")) return interaction.reply({ embeds: [errEm.setDescription("You don't have this role")], ephemeral: true })
                member.roles.remove("1116625591949606964")
                interaction.reply({ embeds: [sucEm.setDescription("Your role has succesfully been removed")], ephemeral: true })
            })
        } catch (error) { 
            console.log(error)
        }
	},
}
