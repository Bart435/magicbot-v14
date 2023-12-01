const { UserSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
module.exports = {
    name: 'addMember',
    customID: 'add',
    description: 'Adds a member to a ticket',
    async execute(interaction, client) {
        const { channel, member } = interaction;
        if (!member.roles.cache.find((r) => r.id === client.config.ticketSystem.handler)) return interaction.reply({ content: "You cannot use these buttons.", ephemeral: true });
        const menu = new UserSelectMenuBuilder()
            .setCustomId('ticket-menu')
            .setPlaceholder("Select a kid that needs adding")
            .setMinValues(1)
            .setMaxValues(1)
        return interaction.reply({ components: [new ActionRowBuilder().addComponents(menu)], ephemeral: true })
    },
}