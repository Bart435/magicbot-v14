const { createTicket } = require("../../lib/systems/ticketSystem");

module.exports = {
	name: 'Other Ticket',
	customID: 'Other',
	description: 'Opens other ticket',
	async execute(interaction, client) {
        createTicket(interaction, client)
	},
};

