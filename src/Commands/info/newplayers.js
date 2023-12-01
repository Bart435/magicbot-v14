const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const connection = require('../../lib/database/sql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('newplayers')
        .setDescription("query's newplayers from database")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option => option.setName('year').setDescription('Select the year').addChoices(
            { name: '2023', value: '2023' },
            { name: '2024', value: '2024' },
            { name: '2025', value: '2025' },
            { name: '2026', value: '2026' },
        ).setRequired(true))
        .addStringOption(option => option.setName('month').setDescription('Select the month').addChoices(
            { name: 'January', value: '1' },
            { name: 'February', value: '2' },
            { name: 'March', value: '3' },
            { name: 'April', value: '4' },
            { name: 'May', value: '5' },
            { name: 'June', value: '6' },
            { name: 'July', value: '7' },
            { name: 'August', value: '8' },
            { name: 'September', value: '9' },
            { name: 'October', value: '10' },
            { name: 'November', value: '11' },
            { name: 'December', value: '12' },
        ).setRequired(false))
        .addStringOption(option => option.setName('day').setDescription('write a day for extreme precicion').setRequired(false)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        if (interaction.guild.id === client.config.info.mainGuild) {
            const year = interaction.options.getString("year");
            const month = interaction.options.getString("month");
            const day = interaction.options.getString("day");
            let date = `${year}`
            let sql = `SELECT * FROM discman.newplayers WHERE date LIKE '!${year}%' ESCAPE'!'`
            if (month) sql = `SELECT * FROM discman.newplayers WHERE date LIKE '!${year}/${month}%' ESCAPE'!'`, date = `${year}/${month}`
            if (month && day) sql = `SELECT * FROM discman.newplayers WHERE date LIKE '!${year}/${month}/${day}%' ESCAPE'!'`, date = `${year}/${month}/${day}`

            connection.query(sql, (err, results) => {
                if (err) throw err;
                a(interaction, results, date)
            })

            async function a(interaction, results, date) {
                const image = new AttachmentBuilder('./src/lib/assets/500x500.png')
                const exampleEmbed = new EmbedBuilder()
                .setTitle('Newplayers')
                .setDescription(`Total new players from requested date:\n${results.length}`)
                .setThumbnail("attachment://500x500.png")
                .setColor(client.config.info.embed.color)
                .setFooter({text: `${date}`})

                await interaction.reply({ embeds: [exampleEmbed], files: [image] })
            }
        }
    },
};