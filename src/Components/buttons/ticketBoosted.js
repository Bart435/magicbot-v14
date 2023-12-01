const { createTicket } = require("../../lib/systems/ticketSystem");

module.exports = {
	name: 'Ticket Boosted',
	customID: 'Ticket Boosted',
	description: 'Opens Ticket Boosted ticket',
	async execute(interaction, client) {
        createTicket(interaction, client)
	},
};

