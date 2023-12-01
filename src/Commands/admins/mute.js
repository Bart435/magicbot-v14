const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, WebhookClient } = require("discord.js");
const connection = require('../../lib/database/sql'); 
const ms = require("ms")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Command to mute members")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addUserOption(option => option.setName('target').setDescription('Select a target to mute').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Provide a duration for the mute (1m, 1h, 1d)').setRequired(false))
        .addStringOption(option => option.setName('reason').setDescription('Provide a reason for the mute').setRequired(false)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const target = interaction.options.getMember("target")
        const duration = interaction.options.getString("duration") || "1y"
        const reason = interaction.options.getString("reason") || "No reason specified"
        const time = ms(duration)
        let errorEmbed = new EmbedBuilder().setColor("Red")
        let succesEmbed = new EmbedBuilder().setColor("Green") 
        let now = Date.now()
        let newDate = new Date(now + time)

        if (!interaction.guild.roles.cache.get(client.config.muteSystem.roleId)) return interaction.reply({ embeds: [errorEmbed.setDescription("The mute role does not exist")]} )

        connection.query(`SELECT * FROM discman.mutes WHERE userid = ${target.id}`, function (err, results) {
            if (err) throw err;
            if (!target.bannable) return interaction.reply({ embeds: [errorEmbed.setDescription("You can't mute this user.")], ephemeral: true })
            if (results.length >= 1) return adjustMute(target, interaction, reason, newDate)
            if (results.length == 0) return setMute(target, interaction, reason, newDate)
            return interaction.reply({ embeds: [errorEmbed.setDescription(`a error occured during performing of this command (query)`)] })
        });

        function setMute(target, interaction, reason, newDate) {
            const sqlQuery = `INSERT INTO discman.mutes (userid, guildid, admin_user, reason, date, active) VALUES ('${target.id}', '${interaction.guildId}', '${interaction.user.id}', '${reason}', '${newDate.toString()}', '1')`
            connection.query(sqlQuery, function (err, results) {
                if (err) throw err;
                if (!results) return interaction.reply({ embeds: [errorEmbed.setDescription("a error occured during performing of this command (setMute)")], ephemeral: true })
                applyMute(target, interaction, reason, newDate)
            })
        }

        function adjustMute(target, interaction, reason, newDate) {
            const sqlQuery = `UPDATE discman.mutes SET date = '${newDate.toString()}', admin_user = '${interaction.user.id}', active = '1' WHERE userid = ${target.id}`
            connection.query(sqlQuery, function (err, results) {
                if (err) throw err;
                if (!results) return interaction.reply({ embeds: [errorEmbed.setDescription("a error occured during performing of this command (adjustMute)")], ephemeral: true })
                applyMute(target, interaction, reason, newDate)
            })
        }

        async function applyMute(target, interaction, reason, newDate) {
            try {
                await target.roles.add(client.config.muteSystem.roleId)
                await interaction.reply({ embeds: [succesEmbed.setDescription(`<@${target.id}> has been muted for ${duration}\nReason: ${reason}`)], ephemeral: true })

                const date = new Date(newDate).getTime()
                const webhookClient = new WebhookClient({ url: client.config.muteSystem.webhook });
                succesEmbed
                    .setDescription(`
                        **User**: <@${target.id}>\n
                        **Muted until**: <t:${parseInt(date / 1000)}:R>\n
                        **reason**: ${reason}\n
                        **Muted by**: <@${interaction.user.id}>`
                    )
                webhookClient.send({ embeds: [succesEmbed] });
            } catch (error) { 
                interaction.reply({ embeds: [errorEmbed.setDescription("Couldn't apply this role")], ephemeral: true })
            }
        }
    },
};