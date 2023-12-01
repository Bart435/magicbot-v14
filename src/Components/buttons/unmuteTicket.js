const { createTicket } = require("../../lib/systems/ticketSystem");
const connection =  require('../../lib/database/sql')
module.exports = {
	name: 'Unmute request',
	customID: 'unmute',
	description: 'Opens unmute ticket',
	async execute(interaction, client) {
        connection.query(`SELECT * FROM discman.tickets WHERE type = '${interaction.customId}' AND closed != 1 AND userid = '${interaction.user.id}'`, (err, res) => {
            if (err) throw err
            if (res.length > 0) return interaction.reply({ content: "You already got a unmute request", ephemeral: true })
            else createTicket(interaction, client)
        })
	},
};

