const { createTicket } = require("../../lib/systems/ticketSystem");

module.exports = {
	name: 'Admin Application modal',
	customID: 'application',
	description: 'Creates a ticket upon submission',
	async execute(interaction, client) {
        createTicket(interaction, client)
	},
}