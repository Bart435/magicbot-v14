const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require("discord.js");
const connection = require('../database/sql');

async function createTicket(interaction, client) {
    const { guild, customId, member } = interaction;
    const id = await new Promise((resolve, reject) => {
        connection.query('SELECT COUNT(*) AS total FROM discman.tickets', function (err, results) {
            resolve(results[0].total.toString())
        });
    })

	// Deciding roles
	let ticketInfo = []
	if (customId == "Ticket Basic") ticketInfo.push('10x', client.config.ticketSystem.handler10x)
	if (customId == "Ticket Boosted") ticketInfo.push('100x', client.config.ticketSystem.handler100x)
    if (customId == "Other") ticketInfo.push('Other', client.config.ticketSystem.handler)
    if (customId == "adminAPP") ticketInfo.push('Application', client.config.ticketSystem.handler)

    await guild.channels.create({
        name: `${ticketInfo[0] + "-" + id}`,
        type: ChannelType.GuildText,
        parent: client.config.ticketSystem.category,
        permissionOverwrites: [
            {
                id: member.id,
                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
            },
            {
                id: ticketInfo[1],
                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
            },
            {
                id: client.config.ticketSystem.everyone,
                deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
            },
        ]
    }).then(async (channel) => {
        const sql = `INSERT INTO discman.tickets (userid, type, channelid, guildid, closed) VALUES ?`;
        const values = [[member.id, customId, channel.id, guild.id, 0]];
        connection.query(sql, [values], function (err, results) {
            if (err) throw err;
        })

        let Embed = new EmbedBuilder()
            .setColor(client.config.info.embed.color)
            .setAuthor({ name: `${guild.name} | Ticket: ${id}`,iconURL: guild.iconURL({ dynamic: true }), })
            .setFooter({ text: "The buttons below are Staff Only Buttons." });

        if (customId == "application") Embed.setDescription(`Ticket Opened By: ${member}\nPlease wait patiently for a response from the Staff team.`)
        else Embed.setDescription(`Ticket Opened By: ${member}\nPlease wait patiently for a response from the Staff team, in the mean while, describe your issue in as much detail as possible.`)
            

        const Buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("close")
                .setLabel("Close Ticket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("💾"),
            new ButtonBuilder()
                .setCustomId("add")
                .setLabel("Add Member")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("➕"),
        );

        channel.send({ embeds: [Embed], components: [Buttons] });
        
        await channel.send({ content: `${member} here is your ticket` }).then((m) => {
            setTimeout(() => {
                m.delete().catch(() => { });
            }, 1 * 5000);
        });

        interaction.reply({ content: `${member} your ticket has been created: ${channel}`, ephemeral: true });
    });
}

module.exports = { createTicket }