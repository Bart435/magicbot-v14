const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const connection = require('../../lib/database/sql');
const { google } = require("googleapis")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("creator")
        .setDescription("All management of the partnered creators at one place")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Adds the creator to the database for automatic video posting')
                .addUserOption(option => option.setName('creator').setDescription('Select the creators discord to apply it to').setRequired(true))
                .addStringOption(option => option.setName('channel').setDescription('Place the channel url here. I SWEAR IF YOU FUCK THIS UP I WILL BEAT YOU MYSELF').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('This removes the creator from the database stopping the auto posting')
                .addUserOption(option => option.setName('creator').setDescription('Select the creators discord where you want to remove it from').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('extend')
                .setDescription('Extends the time for autoposting for already registerd creators')
                .addUserOption(option => option.setName('creator').setDescription('Select the creators discord for who you want to extend it for').setRequired(true))  
        ),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const Sub = interaction.options.getSubcommand();
        const succesEmbed = new EmbedBuilder().setColor("Green");
        const errorEmbed = new EmbedBuilder().setColor("Red");

        // Find admins in the database
        const id = await new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM discman.admin WHERE userid = ${interaction.user.id}`, (err, results) => {
                if (err) throw err
                if (results.length <= 0) return resolve(false)
                else resolve(true)
            });
        });

        // IF there is no admin found, Retrive the process
        if (!id) return interaction.reply({embeds: [errorEmbed.setDescription("You must be admin to perform this command")], ephemeral: true});

        switch (Sub) {
            case "add": {
                const target = interaction.options.getMember("creator")
                let channel_URL = interaction.options.getString("channel")

                const youtube = google.youtube({ 
                    version: "v3", 
                    auth: client.config.secrets.youtubeapi_key 
                });

                const res =  await youtube.search.list({ 
                    part: 'id,snippet',
                    q: channel_URL
                })
                if (res.data.items.length == 0) return interaction.reply({ embeds: [errorEmbed.setDescription("Creator not found. Try using the part behind 'https://www.youtube.com/channel/' as url")] })

                const ytChannelId = res.data.items[0].snippet.channelId;

                const date = new Date()
                const start = Date.now()
                const end = date.setDate(date.getDate() + 90)

                if (!channel_URL.startsWith("https")) channel_URL = `https://www.youtube.com/channel/${channel_URL}`
                connection.query(`INSERT INTO discman.creators (userid, channelId, channelURL, start_timestamp, end_timestamp) VALUES ('${target.id}', '${ytChannelId}', '${channel_URL}', ${start}, ${end})`, (err, results) => {
                    if (err) throw err
                    if (!results) return interaction.reply({ embeds: [errorEmbed.setDescription("Something went wrong")], ephemeral: true })
                    return interaction.reply({ embeds: [succesEmbed.setDescription(`You succesfully added <@${target.id}> as partnerd creator`)] })
                });
            }
            break;

            case "remove": {
                return interaction.reply({ embeds: [errorEmbed.setDescription("Not done yet")] })
                const target = interaction.options.getMember("creator")

                connection.query(`UPDATE discman.rewardings SET points = points - ${amount} WHERE userid = ${target.id}`, (err, results) => {
                    if (err) throw err
                    if (results.affectedRows <= 0) return interaction.reply({ embeds: [errorEmbed.setDescription("User must be in the database in order to remove points")], ephemeral: true })
                    else return interaction.reply({ embeds: [succesEmbed.setDescription(`You succesfully substracted ${amount} points from <@${target.id}>`)] })
                });
            }
            break;

            case "extend": {
                return interaction.reply({ embeds: [errorEmbed.setDescription("Not done yet")] })
                const target = interaction.options.getMember("creator")

                connection.query(`UPDATE discman.rewardings SET points = ${amount} WHERE userid = ${target.id}`, (err, results) => {
                    if (err) throw err
                    if (results.affectedRows <= 0) return interaction.reply({ embeds: [errorEmbed.setDescription("User must be in the database in order to set points")], ephemeral: true })
                    else return interaction.reply({ embeds: [succesEmbed.setDescription(`You succesfully set ${amount} points of <@${target.id}>`)] })
                });
                interaction.reply({ content: `${target.displayName} points have been set to ${amount}` })
            }
            break;
        }
    },
};