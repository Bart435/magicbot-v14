const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	EmbedBuilder,
} = require("discord.js");
const { Server } = require("@fabricio-191/valve-server-query");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("serverping")
		.setDescription("Shows servers latency")
		.setDefaultMemberPermissions(
			PermissionFlagsBits.UseApplicationCommands
		),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		interaction.deferReply();
		const basic_servers = client.config.servers["10x"];
		const boosted_servers = client.config.servers["100x"];
		const beginner_servers = client.config.servers.beginners;

		let field_basic = "";
		let field_boosted = "";
		let field_beginner = "";

		let response = new EmbedBuilder()
			.setDescription("Ping from all our game servers")
			.setColor(client.config.info.embed.color);

		for (let i = 0; i < basic_servers.length; i++) {
			const info = await get_info(
				basic_servers[i].ip,
				basic_servers[i].queryPort
			);
			field_basic = field_basic + info;
		}

		for (let i = 0; i < boosted_servers.length; i++) {
			const info = await get_info(
				boosted_servers[i].ip,
				boosted_servers[i].queryPort
			);
			field_boosted = field_boosted + info;
		}

		for (let i = 0; i < beginner_servers.length; i++) {
			const info = await get_info(
				beginner_servers[i].ip,
				beginner_servers[i].queryPort
			);
			field_beginner = field_beginner + info;
		}

		response.addFields(
			{ name: "10x Servers", value: field_basic },
			{ name: "100x Servers", value: field_boosted },
			{ name: "Beginner Servers", value: field_beginner }
		);

		interaction.editReply({ embeds: [response] });
	},
};

async function get_info(server_ip, server_port) {
	try {
		const server = await Server({
			ip: server_ip,
			port: server_port,
			timeout: 3000,
		});
		const info = await server.getInfo();
		const str =
			info.map +
			" " +
			":" +
			" " +
			"``" +
			`${server.lastPing}` +
			"``" +
			"\n";
		server.disconnect();
		return str;
	} catch (err) {
		console.log(err);
		return "offline\n";
	}
}
