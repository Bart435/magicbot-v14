const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
	name: 'exchange',
	customID: 'exchange',
	description: 'returns exchange embed',
	execute(interaction, client) {
        const image = new AttachmentBuilder('./src/lib/assets/500x500.png')

		const embed = new EmbedBuilder()
            .setTitle("Exhange Bank")
		    .setColor(client.config.info.embed.color)
            .setThumbnail("attachment://500x500.png")
		    .setDescription("Press the button with the amount you would like to exchange to Magic Points")

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("value1")
                .setLabel(`${client.config.walletSystem.value_1}`)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("value2")
                .setLabel(`${client.config.walletSystem.value_2}`)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("value3")
                .setLabel(`${client.config.walletSystem.value_3}`)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("value4")
                .setLabel(`${client.config.walletSystem.value_4}`)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("value5")
                .setLabel(`${client.config.walletSystem.value_5}`)
                .setStyle(ButtonStyle.Primary),
        );



    	interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true })
	},
};