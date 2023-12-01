const { CommandInteraction, InteractionType } = require("discord.js");
const connection = require("../../lib/database/sql");

module.exports = {
	name: "interactionCreate",
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	execute(interaction, client) {
		const command = client.commands.get(interaction.commandName);
		try {
			if (interaction.isChatInputCommand()) {
				if (!command)
					return interaction.reply({
						content: "This command is outdated!",
					});
				connection.query(
					`INSERT INTO discman.commands_used (guildid, channelid, command, userid) VALUES ('${interaction.guild.id}', '${interaction.channel.id}', '${interaction.commandName}', '${interaction.user.id}')`,
					(err) => {
						if (err) throw err;
					}
				);
				command.execute(interaction, client);
			}
			if (
				interaction.type ==
				InteractionType.ApplicationCommandAutocomplete
			) {
				command.autocomplete(interaction, client);
			}
		} catch (error) {
			console.log(interaction);
		}
	},
};
