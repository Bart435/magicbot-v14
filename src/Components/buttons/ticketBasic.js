const { createTicket } = require("../../lib/systems/ticketSystem");

module.exports = {
	name: 'Ticket Basic',
	customID: 'Ticket Basic',
	description: 'Opens Ticket Basic ticket',
	async execute(interaction, client) {
        createTicket(interaction, client)
	},
};

