const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const connection = require("../../lib/database/sql");
const { createMessage } = require("../../lib/events/createMessage");
const dateHelper = require("../../lib/helpers/dateHelpers");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		let timer = setInterval(function () {
			connection.query(
				`SELECT * FROM discman.posts WHERE slug = 'wipe100x'`,
				function (err, results) {
					if (err) throw err;
					for (let i = 0; i < results.length; i++) {
						let MsgKey = results[i].slug;
						let guildId = results[i].guildid;
						let channelID = results[i].channelid;
						let messageID = results[i].messageid;
						if (!MsgKey)
							return console.error("MsgKey is not defined");
						if (!guildId)
							return console.error("GuildId is not defined");
						if (!channelID)
							return console.error("ChannelID is not defined");
						if (!messageID)
							return createMessage(
								channelID,
								client,
								guildId,
								MsgKey
							);

						connection.query(
							`SELECT * FROM discman.wipes WHERE slug = '100x'`,
							function (err, results) {
								if (err) throw err;
								setTimer(
									messageID,
									channelID,
									client,
									guildId,
									MsgKey,
									results[0].wipe_timestamp,
									results[0].last_timestamp
								);
							}
						);
					}
				}
			);
		}, 120000);

		function setTimer(
			messageID,
			channelID,
			client,
			guildId,
			MsgKey,
			wipe_timestamp,
			last_timestamp
		) {
			const channel = client.channels.cache.get(channelID);
			if (!channel) {
				const sqlQuery = `DELETE FROM discman.posts WHERE channelid = ${channelID} AND guildid = ${guildId} AND slug = "${MsgKey}"`;
				return connection.query(sqlQuery, function (err) {
					if (err) throw err;
				});
			}

			const dateHelpers = new dateHelper.DateFunctions();
			const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
			const banner = new AttachmentBuilder(
				"./src/lib/assets/banners/wipedateBanner.png"
			);

			const embed = new EmbedBuilder()
				.setTitle("Magic Ark Boosted (100X servers)")
				.setDescription(
					`**Previous wipe date** : ${
						last_timestamp == 0
							? "Not available"
							: dateHelpers.toDiscordTimestampDateMonth(
									last_timestamp
							  )
					}\n\n**Next wipe date**: ${
						wipe_timestamp == 0
							? "Not available"
							: dateHelpers.toDiscordTimestampDateTime(
									wipe_timestamp
							  )
					}\n\n**Count down** : ${
						wipe_timestamp == 0
							? "Not available"
							: dateHelpers.toDiscordTimestampTimeUntil(
									wipe_timestamp
							  )
					}`
				)
				.addFields(
					{
						name: "Settings :",
						value: "<#1098853940491190374>",
						inline: true,
					},
					{
						name: "Join links :",
						value: "<#1131983380544766012>",
						inline: true,
					},
					{
						name: "Server rules :",
						value: "<#891966249217716255>",
						inline: true,
					}
				)
				.setThumbnail("attachment://500x500.png")
				.setImage("attachment://wipedateBanner.png")
				.setColor(client.config.info.embed.color)
				.setFooter({
					text: client.config.info.embed.footer,
				})
				.setTimestamp();

			const now = new Date().getTime();
			if (wipe_timestamp != 0) {
				if (wipe_timestamp <= now) {
					connection.query(
						`UPDATE discman.wipes SET wipe_timestamp = '0', last_timestamp = '${wipe_timestamp}' WHERE slug = '100x'`,
						function (err) {
							if (err) throw err;
						}
					);
				}
			}

			channel.messages
				.fetch(messageID)
				.then((message) => {
					message.edit({ embeds: [embed], files: [image, banner] });
				})
				.catch((err) => {
					createMessage(channelID, client, guildId, MsgKey);
				});
		}
	},
};
