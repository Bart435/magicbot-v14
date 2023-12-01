const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const connection = require('../../lib/database/sql');
const { get_steam } = require('../../lib/dataQuerys/getSteam');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Gives all info about a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addUserOption(option => option.setName('target').setDescription('Select a target fetch data from').setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const target = interaction.options.getMember("target");
        connection.query(`SELECT CAST(steamid AS CHAR) as steamid FROM wdiscordintegrator.discord_integration_players WHERE DiscordID = ${target.id}`, function (err, results) {
            if (err) throw err;
            if (results <= 0) return interaction.reply({ content: "No data found", ephemeral: true })
            if (results[0].steamid <= 0) return interaction.reply({ content: "User has not linked there discord to ark", ephemeral: true })
            let steamId = `${results[0].steamid}`
            get_steam(steamId, interaction, target)
        });

    },
};