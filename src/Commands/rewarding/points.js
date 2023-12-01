const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const connection = require('../../lib/database/sql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("points")
        .setDescription("This will show you the amount of discord points you have")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const succesembed = new EmbedBuilder().setColor("Green");
        const errorembed = new EmbedBuilder().setColor("Red");
        const image = new AttachmentBuilder('./src/lib/assets/500x500.png');

        connection.query(`SELECT * FROM discman.rewardings WHERE userid = ${interaction.user.id}`, (err, results) => {
            if (err) throw err
            if (results.length <= 0) return interaction.reply({ embeds: [errorembed.setDescription("You haven't send a message yet to receive points")], ephemeral: true })
            succesembed
            .setTitle(`${interaction.member.displayName}'s points`)
            .setThumbnail("attachment://500x500.png")
            .addFields(
                {name: "points", value: `${results[0].points}`, inline: true}, 
                {name: 'Total gained', value: `${results[0].gainedPoints}`, inline: true}
            )
            interaction.reply({ embeds: [succesembed], files: [image], ephemeral: true })
        });
    },
};

