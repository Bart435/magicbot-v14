const { createTicket } = require("../../lib/systems/ticketSystem");

module.exports = {
	name: 'Admin Application',
	customID: 'adminAPP',
	description: 'Opens admin application',
	async execute(interaction, client) {
        createTicket(interaction, client)
    }
}
