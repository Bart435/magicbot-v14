const { EmbedBuilder, GuildMember, WebhookClient } = require("discord.js");

module.exports = {
	name: "guildMemberAdd",
	/**
	 *
	 * @param {GuildMember} member
	 */
	async execute(member, client) {
		if (member.guild.id !== client.config.info.mainGuild) return;
		const { user, guild, roles } = member;

		const webhookClient = new WebhookClient({
			url: client.config.welcomeSystem.webhook,
		});
		const WelcomeEmbed = new EmbedBuilder()
			.setColor(client.config.info.embed.color)
			.setAuthor({
				name: `${user.tag}`,
				iconURL: user.displayAvatarURL({ dynamic: true }),
			})
			.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setDescription(`
                **Welcome** ${member} to **${guild.name}**!\n
                **Account Created**: <t:${parseInt(
					user.createdTimestamp / 1000
				)}:R>\n
		        **Account ID**: || ${user.id} || \n
                **Latest Member Count**: \`${guild.memberCount}\``);

		try {
			if (!roles.cache.has("1116625591949606964")) {
				roles.add("1116625591949606964");
			}
		} catch (error) {
			console.log(error);
		}

		webhookClient.send({ embeds: [WelcomeEmbed] });
	},
};
