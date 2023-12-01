const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const connection = require('../../lib/database/sql');

// Standarize functions
const { get_steamid } = require('../../lib/dataQuerys/getSteamid');
const { apply_points } = require("../../lib/dataQuerys/addPoints");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exchange")
        .setDescription("This allows you to exhange your discord points for MagicPoints")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of points you want to cash in').setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
     async execute(interaction, client) {
        // Interaction variables
        const DCamount = interaction.options.getInteger("amount");
        const discordid = interaction.user.id;
        // Embeds
        const succesEmbed = new EmbedBuilder().setColor("Green");
        const errorEmbed = new EmbedBuilder().setColor("Red");
        // user data variables
        const steamid = await get_steamid(discordid);
        const amount = (DCamount / 2).toFixed(0);

        // Catch
        if (!steamid) return interaction.reply({embeds: [errorEmbed.setDescription("You have not linked your discord yet")], ephemeral: true})
        
        connection.query(`SELECT points FROM discman.rewardings WHERE userid = ${discordid}`, (err, results) => {
            // Catches
            if (err) throw err;
            if (results.length <= 0) return interaction.reply({ embeds: [errorEmbed.setDescription("You haven't send a message yet in this discord")], ephemeral: true })
            if (DCamount > results[0].points) return interaction.reply({ embeds: [errorEmbed.setDescription("You don't have the amount of points you want to exchange")], ephemeral: true })
            // appliance and updating
            apply_points(steamid, amount, client)
            connection.query(`UPDATE discman.rewardings SET points = points - ${DCamount} WHERE userid = ${discordid}`, (err, results) => {
                // Catches
                if (err) throw err
                if (results.affectedRows <= 0) return interaction.reply({ embeds: [errorEmbed.setDescription("User must be in the database in order to remove points")], ephemeral: true })
                // Final
                else return interaction.reply({ embeds: [succesEmbed.setDescription(`You have exchanged ${DCamount} of points into ${amount} MagicPoints.`)], ephemeral: true })
            });
        })
    },
};

