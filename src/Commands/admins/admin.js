const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { get_steamid } = require('../../lib/dataQuerys/getSteamid');
const connection = require('../../lib/database/sql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Admining side of the features")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(subcommand =>
            subcommand
                .setName('give-points')
                .setDescription('Gives selected user a provided amount of points')
                .addUserOption(option => option.setName('target').setDescription('Select the user that you want to give points to').setRequired(true))
                .addIntegerOption(option => option.setName('amount').setDescription('Select the amount of points you want to give').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove-points')
                .setDescription('Removes provided amount of points from selected user')
                .addUserOption(option => option.setName('target').setDescription('Select the user that you want to remove points from').setRequired(true))
                .addIntegerOption(option => option.setName('amount').setDescription('Select the amount of points you want to remove').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set-points')
                .setDescription('Sets points to provided amount of selected user')
                .addUserOption(option => option.setName('target').setDescription('Select the user that you want to remove points from').setRequired(true))
                .addIntegerOption(option => option.setName('amount').setDescription('Select the amount of points you want to set it to').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset-points')
                .setDescription('Resets points of selected user')
                .addUserOption(option => option.setName('target').setDescription('Select the user that you want to remove points from').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset-all-points')
                .setDescription('WARNING! Resets all points of every user')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .addUserOption(option => option.setName('target').setDescription('Select a user that you want to promote to admin').setRequired(true))
                .setDescription('Adds a admin to the discordbot database')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .addUserOption(option => option.setName('target').setDescription('Select a user that you want to demote from admin').setRequired(true))
                .setDescription('Removes a admin from the discordbot database')
        ),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const Sub = interaction.options.getSubcommand();
        const succesEmbed = new EmbedBuilder().setColor("Green");
        const errorEmbed = new EmbedBuilder().setColor("Red");
        const id = await new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM discman.admin WHERE userid = ${interaction.user.id}`, (err, results) => {
                if (err) throw err
                if (results.length <= 0) return resolve(false)
                else resolve(true)
            });
        })
        if (!id) return interaction.reply({embeds: [errorEmbed.setDescription("You must be admin to perform this command")], ephemeral: true})
        switch (Sub) {
            case "give-points": {
                const target = interaction.options.getMember("target")
                const amount = interaction.options.getInteger("amount")
                connection.query(`UPDATE discman.rewardings SET points = points + ${amount}, gainedPoints = gainedpoints + ${amount} WHERE userid = ${target.id}`, (err, results) => {
                    if (err) throw err
                    if (results.affectedRows <= 0) return interaction.reply({ embeds: [errorEmbed.setDescription("User must be in the database in order to give points")], ephemeral: true })
                    else return interaction.reply({ embeds: [succesEmbed.setDescription(`You succesfully added ${amount} points to <@${target.id}>`)] })
                });
            }
                break;
            case "remove-points": {
                const target = interaction.options.getMember("target")
                const amount = interaction.options.getInteger("amount")
                connection.query(`UPDATE discman.rewardings SET points = points - ${amount} WHERE userid = ${target.id}`, (err, results) => {
                    if (err) throw err
                    if (results.affectedRows <= 0) return interaction.reply({ embeds: [errorEmbed.setDescription("User must be in the database in order to remove points")], ephemeral: true })
                    else return interaction.reply({ embeds: [succesEmbed.setDescription(`You succesfully substracted ${amount} points from <@${target.id}>`)] })
                });
            }
                break;
            case "set-points": {
                const target = interaction.options.getMember("target")
                const amount = interaction.options.getInteger("amount")
                connection.query(`UPDATE discman.rewardings SET points = ${amount} WHERE userid = ${target.id}`, (err, results) => {
                    if (err) throw err
                    if (results.affectedRows <= 0) return interaction.reply({ embeds: [errorEmbed.setDescription("User must be in the database in order to set points")], ephemeral: true })
                    else return interaction.reply({ embeds: [succesEmbed.setDescription(`You succesfully set ${amount} points of <@${target.id}>`)] })
                });
                interaction.reply({ content: `${target.displayName} points have been set to ${amount}` })
            }
                break;
            case "reset-points": {
                const target = interaction.options.getMember("target")
                connection.query(`UPDATE discman.rewardings SET points = 0, gainedPoints = 0 WHERE userid = ${target.id}`, (err, results) => {
                    if (err) throw err
                    if (results.affectedRows <= 0) return interaction.reply({ embeds: [errorEmbed.setDescription("User must be in the database in order to reset points")], ephemeral: true })
                    else return interaction.reply({ embeds: [succesEmbed.setDescription(`You succesfully reset <@${target.id}> points`)] })
                });
            }
                break;
            case "reset-all-points": {
                if (interaction.user.id != client.config.info.ownerId) return interaction.reply({ embeds: [errorEmbed.setDescription("This command can only be executed by the bot's owner")], ephemeral: true })
                connection.query('TRUNCATE TABLE discman.rewardings', (err, results) => {
                    if (err) throw err
                    if (!results) return interaction.reply({ embeds: [errorEmbed.setDescription("Couldn't reset all points")], ephemeral: true })
                    else return interaction.reply({ embeds: [succesEmbed.setDescription(`You succesfully reset everyone's points`)] })
                });
            }
                break;
            case "add": {
                const target = interaction.options.getMember("target")
                const discordid = target.id;
                const steamid = await get_steamid(discordid)

                if(!steamid) return interaction.reply({ embeds: [errorEmbed.setDescription("User must have his Discord linked with ark")], ephemeral: true })

                connection.query(`INSERT INTO discman.admin (steamid, userid) VALUES ('${steamid}', '${discordid}')`, (err, results) => {
                    if (err) throw err;
                    if (results) interaction.reply({ embeds: [succesEmbed.setDescription("User has been succesfully added as admin")], ephemeral: true })
                })
            }
                break;
            case "remove": {
                const target = interaction.options.getMember("target")
                const discordid = target.id;
                const steamid = await get_steamid(discordid)

                if(!steamid) return interaction.reply({ embeds: [errorEmbed.setDescription("User must have his Discord linked with ark")], ephemeral: true })

                connection.query(`DELETE FROM discman.admin WHERE steamid = ${steamid}`, (err, results) => {
                    if (err) throw err;
                    if (results) interaction.reply({ embeds: [succesEmbed.setDescription("User has been succesfully removed as admin")], ephemeral: true })
                })
            }
                break;
        }
    },
};