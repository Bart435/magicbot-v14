const { EmbedBuilder, WebhookClient } = require("discord.js");
const { get_steamid, sub_dcpoints, add_points, get_points  } = require("../../lib/systems/kitSystem");

module.exports = {
	name: 'value2',
	customID: 'value2',
	description: 'value 2 of exchange',
	async execute(interaction, client) {
		// Setting the base embeds
		let errEmbed = new EmbedBuilder().setColor("Red")
		let sucEmbed = new EmbedBuilder().setColor("Green")
		let finEmbed = new EmbedBuilder().setColor("Green")

		// Checking category
		const parentId = interaction.channel.parent.id

		// Deciding cluster
		let cluster = "unknown"
		if (parentId == client.config.info.basicCategory) cluster = "10x"
		if (parentId == client.config.info.boostedCategory) cluster = "100x"

		// setting amount
		let dcamount = client.config.walletSystem.value_2
		let amount = client.config.walletSystem.value_2 / client.config.walletSystem.ratio

		// Checking for steam id
		const steamid = await get_steamid(interaction.user.id)

		// If steamid is not found in the database
		if (!steamid) return interaction.reply( { embeds: [errEmbed.setDescription("You must verify your discord first")], ephemeral: true } )
					
		// Making sure the player is there
		const player_is_there = await get_points(steamid, parentId)
		
		// if there is no user
		if (!player_is_there) return interaction.reply( { embeds: [errEmbed.setDescription("You must join our server first before exchange")], ephemeral: true } )

		// Substacting x amount of discord points
		const substract = await sub_dcpoints(interaction.user.id, dcamount, amount, steamid, parentId)
	
		// If user doesn't have enough points
		if (!substract) return interaction.reply( { embeds: [errEmbed.setDescription("You don't have enough points to exchange this much")], ephemeral: true } )
		
		// Adding x name kit
		const points_add = await add_points(steamid, amount, parentId)

		// Incase something goes wrong with applying there points
		if (!points_add) return interaction.reply( { embeds: [errEmbed.setDescription("Make sure you have joined this cluster before exchanging points")], ephemeral: true } )
					

		// Purchase succesfull
		interaction.reply( { embeds: [sucEmbed.setDescription(`${amount} has been added to your account. You can find it in your shop`)], ephemeral: true } )

		// Defining webhook client for logs
		const webhookClient = new WebhookClient({ url: client.config.kitSystem.webhook });

		// logging purchase
		return webhookClient.send({ 
			embeds: [
				finEmbed.setTitle("Points exchanged")
				.addFields(
					{name: "User", value: `${interaction.user.tag}`},
					{name: "SteamId", value: `${steamid}`},
					{name: "DiscordId", value: `${interaction.user.id}`},
					{name: "amount ", value: `${dcamount} > ${amount}`},
					{name: "Cluster", value: `${cluster}`}
				)
			] 
		});
	},
};