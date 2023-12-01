const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, WebhookClient } = require("discord.js");
const connection = require('../../lib/database/sql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Command to mute members")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addUserOption(option => option.setName('target').setDescription('Select a target to unmute').setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const target = interaction.options.getMember("target")
        let errorEmbed = new EmbedBuilder().setColor("Red")
        let succesEmbed = new EmbedBuilder().setColor("Green")

        if (!interaction.guild.roles.cache.get(client.config.muteSystem.roleId)) return interaction.reply({ embeds: [errorEmbed.setDescription("The mute role does not exist")]} )

        connection.query(`SELECT * FROM discman.mutes WHERE userid = ${target.id}`, function (err, results) {
            if (err) throw err;
            if (!target.bannable) return interaction.reply({ embeds: [errorEmbed.setDescription("You can't unmute this user")], ephemeral: true })
            if (results.length >= 1) return removeMute(target, interaction)
            if (results.length == 0) interaction.reply({ embeds: [errorEmbed.setDescription("Couldn't find this user in the database")] })
            return interaction.reply({ embeds: [errorEmbed.setDescription(`a error occured during performing of this command (query)`)] })
        });

        async function removeMute(target, interaction) {
            try {
                await target.roles.remove(client.config.muteSystem.roleId)
                await interaction.reply({ embeds: [succesEmbed.setDescription(`<@${target.id}> has been unmuted`)], ephemeral: true })

                connection.query(`UPDATE discman.mutes SET date = '0', admin_user = '${interaction.user.id}', active = '0' WHERE userid = ${target.id}`, function (err, results) {
                    if (err) throw err;
                    if (!results) return interaction.reply({ embeds: [errorEmbed.setDescription("a error occured during performing of this command (adjustMute)")], ephemeral: true })
                })

                const webhookClient = new WebhookClient({ url: client.config.muteSystem.webhook });
                webhookClient.send({ embeds: [errorEmbed.setDescription(`<@${target.id}> Got unmuted`)] });
            } catch (error) {
                interaction.reply({ embeds: [errorEmbed.setDescription("Couldn't remove this role")], ephemeral: true })
            }
        }
    },
};