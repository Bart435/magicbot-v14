const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows help embed.")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        const image = new AttachmentBuilder('./src/lib/assets/500x500.png')
        const embed = new EmbedBuilder()
            .setTitle("Commands")
            .setColor(client.config.info.embed.color)
            .setThumbnail("attachment://500x500.png")
            .addFields(
                { name: 'Info', value: "/ping - Shows bots latency\n/vote - Shows all vote urls\n/playerinfo - Shows your ingame information"},
                { name: 'Engagement', value: '/points - Shows your discord points\n/exchange - Discord points exchange to arkshop points' },
                { name: 'Verified', value: '/verify - Discord to steam linking\n/kickme - Kicks your character of the map' },
            );
        interaction.reply({ embeds: [embed], files: [image] });
    },
};