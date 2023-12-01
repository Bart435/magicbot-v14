const { EmbedBuilder, WebhookClient } = require("discord.js");
const connection = require('../../lib/database/sql');
const discordTranscripts = require('discord-html-transcripts');
const { get_tickets } = require("../../lib/dataQuerys/getTicket");

module.exports = {
	name: 'closeTickets',
	customID: 'close',
	description: 'Closes the said ticket and creates a transcript',
	async execute(interaction, client) {
        const { channel, member } = interaction;
        if (!member.roles.cache.find((r) => r.id === client.config.ticketSystem.handler))
        return interaction.reply({ content: "You cannot use these buttons.", ephemeral: true });
        
        const attachment = await discordTranscripts.createTranscript(channel);
        const sqlQuery = `UPDATE discman.tickets SET closed = 1, closed_by = ${member.id} WHERE channelid = ${channel.id}`;
        connection.query(sqlQuery, function (err, results) {
            if (err) throw err;
            if (!results) return
            interaction.reply({ content: "This channel will be closed in a couple seconds." });
            setTimeout(() => {
                channel.delete();
                createTranscript(attachment, channel, client)
            }, 15 * 1000);
        });

        
        async function createTranscript(attachment, channel, client) {
            const ticketData = await get_tickets(channel)
            const webhookClient = new WebhookClient({ url: client.config.ticketSystem.webhook });
        
            const transcriptsEmbed = new EmbedBuilder()
            .setColor(client.config.info.embed.color)
            .addFields(
                {name: "Ticket transcript", value: `**Author:** <@${ticketData[0].userid}>\n**Type:** ${ticketData[0].type}\n**Closed By:** <@${ticketData[0].closed_by}>\n**GuildID:** ${ticketData[0].guildid}`}
            )
        
            webhookClient.send({ embeds: [transcriptsEmbed], files: [attachment] });
        }
        
	},
}