const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ticket-menu',
    customID: 'ticket-menu',
    description: 'Just a got damn menu okay',
    async execute(interaction, client) {
        const embed = new EmbedBuilder().setColor("Green").setDescription(`<@${interaction.values[0]}> has been succesfully added to this ticket`)
        interaction.channel.permissionOverwrites.edit(interaction.values[0], {
            SendMessages: true,
            ViewChannel: true,
            AttachFiles: true,
            ReadMessageHistory: true
        }).then(
            interaction.reply({ embeds: [embed] })
        )
    },
}