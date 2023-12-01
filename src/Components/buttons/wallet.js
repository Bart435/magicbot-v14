const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require("discord.js");
const { get_steamid, get_points, get_dcpoints } = require("../../lib/systems/kitSystem")

module.exports = {
	name: 'wallet',
	customID: 'wallet',
	description: 'returns wallet embed',
	async execute(interaction, client) {
		// Setting the base embeds
		const image = new AttachmentBuilder('./src/lib/assets/500x500.png')
		let errEmbed = new EmbedBuilder().setColor("Red")
		let sucEmbed = new EmbedBuilder().setTitle("Your points").setColor(client.config.info.embed.color).setThumbnail("attachment://500x500.png")
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("exchange")
                .setLabel("Exchange")
                .setStyle(ButtonStyle.Primary),
        );

		// Checking category
		const parentId = interaction.channel.parent.id

		// Checking for steam id
		const steamid = await get_steamid(interaction.user.id)

		// If steamid is not found in the database
		if (!steamid) return interaction.reply( { embeds: [errEmbed.setDescription("You must verify your discord first")], ephemeral: true } )
		
		// Get points
		const points = await get_points(steamid, parentId)

		// Incase something goes wrong with getting points
		if (!points) return interaction.reply( { embeds: [errEmbed.setDescription("Make sure you have joined this cluster before using this button")], ephemeral: true } )
		
		// Get dcpoints
		const dcpoints = await get_dcpoints(interaction.user.id, parentId)

		// Incase something goes wrong with getting points
		if (!dcpoints) return interaction.reply( { embeds: [errEmbed.setDescription("Make sure you have joined this cluster before using this button")], ephemeral: true } )
		
		// Succesfull
		return interaction.reply( { embeds: [sucEmbed.setDescription(`Ingame Points : ${points}\nDiscord Points: ${dcpoints}`)],components: [button], files: [image], ephemeral: true } )
	},
};