const { EmbedBuilder } = require("discord.js");
const connection = require("../../lib/database/sql");
const { createMessage } = require("../../lib/events/createMessage");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		let timer = setInterval(function () {
			const sqlQuery = `SELECT * FROM discman.posts WHERE slug = 'scoreboard10x'`;
			connection.query(sqlQuery, function (err, results) {
				if (err) throw err;
				for (let i = 0; i < results.length; i++) {
					let MsgKey = results[i].slug;
					let guildId = results[i].guildid;
					let channelID = results[i].channelid;
					let messageID = results[i].messageid;
					if (!MsgKey) return console.error("MsgKey is not defined");
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
					setScoreboard(
						messageID,
						channelID,
						client,
						guildId,
						MsgKey
					);
				}
			});
		}, 3600000);

		function setScoreboard(messageID, channelID, client, guildId, MsgKey) {
			const channel = client.channels.cache.get(channelID);
			if (!channel) {
				const sqlQuery = `DELETE FROM discman.posts WHERE channelid = ${channelID} AND guildid = ${guildId} AND slug = "${MsgKey}"`;
				return connection.query(sqlQuery, function (err) {
					if (err) throw err;
				});
			}
			const sqlQuery1 = `SELECT PlayTime, PlayerName FROM advanced_achievements10x.advancedachievements_playerdata ORDER BY PlayTime DESC LIMIT 5`;
			const sqlQuery2 = `SELECT DinoKills, PlayerName FROM advanced_achievements10x.advancedachievements_playerdata ORDER BY DinoKills DESC LIMIT 5`;
			const sqlQuery3 = `SELECT WildDinoKills, PlayerName FROM advanced_achievements10x.advancedachievements_playerdata ORDER BY WildDinoKills DESC LIMIT 5`;
			const sqlQuery4 = `SELECT DeathByPlayer, PlayerName FROM advanced_achievements10x.advancedachievements_playerdata ORDER BY DeathByPlayer DESC LIMIT 5`;
			const sqlQuery5 = `SELECT PlayerKills, PlayerName FROM advanced_achievements10x.advancedachievements_playerdata ORDER BY PlayerKills DESC LIMIT 5`;
			const sqlQuery6 = `SELECT DeathByWildDino, PlayerName FROM advanced_achievements10x.advancedachievements_playerdata ORDER BY DeathByWildDino DESC LIMIT 5`;

			const embed = new EmbedBuilder()
				.setTitle("Scoreboard")
				.setColor(client.config.info.embed.color)
				.setFooter({
					text: client.config.info.embed.footer,
				});

			connection.query(sqlQuery1, function (err, results) {
				const PlayTime = [];
				if (err) console.error(err);
				for (let i = 0; i < results.length; i++) {
					let hours = results[i].PlayTime / 60;
					PlayTime.push(
						`${results[i].PlayerName.substring(
							0,
							9
						)} - ${hours.toFixed(1)}`
					);
				}
				const message =
					"```" +
					`${PlayTime[0]} H\n${PlayTime[1]} H\n${PlayTime[2]} H\n${PlayTime[3]} H\n${PlayTime[4]} H` +
					"```";
				embed.addFields({
					name: "PlayTime",
					value: message,
					inline: true,
				});

				connection.query(sqlQuery2, function (err, results) {
					const DinoKills = [];
					if (err) console.error(err);
					for (let i = 0; i < results.length; i++) {
						DinoKills.push(
							`${results[i].PlayerName.substring(0, 9)} - ${
								results[i].DinoKills
							}`
						);
					}
					const message =
						"```" +
						`${DinoKills[0]}\n${DinoKills[1]}\n${DinoKills[2]}\n${DinoKills[3]}\n${DinoKills[4]}` +
						"```";
					embed.addFields({
						name: "DinoKills",
						value: message,
						inline: true,
					});

					connection.query(sqlQuery3, function (err, results) {
						const WildDinoKills = [];
						if (err) console.error(err);
						for (let i = 0; i < results.length; i++) {
							WildDinoKills.push(
								`${results[i].PlayerName.substring(0, 9)} - ${
									results[i].WildDinoKills
								}`
							);
						}
						const message =
							"```" +
							`${WildDinoKills[0]}\n${WildDinoKills[1]}\n${WildDinoKills[2]}\n${WildDinoKills[3]}\n${WildDinoKills[4]}` +
							"```";
						embed.addFields({
							name: "WildDinoKills",
							value: message,
							inline: true,
						});

						connection.query(sqlQuery4, function (err, results) {
							const DeathByPlayer = [];
							if (err) console.error(err);
							for (let i = 0; i < results.length; i++) {
								DeathByPlayer.push(
									`${results[i].PlayerName.substring(
										0,
										9
									)} - ${results[i].DeathByPlayer}`
								);
							}
							const message =
								"```" +
								`${DeathByPlayer[0]}\n${DeathByPlayer[1]}\n${DeathByPlayer[2]}\n${DeathByPlayer[3]}\n${DeathByPlayer[4]}` +
								"```";
							embed.addFields({
								name: "DeathByPlayer",
								value: message,
								inline: true,
							});

							connection.query(
								sqlQuery5,
								function (err, results) {
									const PlayerKills = [];
									if (err) console.error(err);
									for (let i = 0; i < results.length; i++) {
										PlayerKills.push(
											`${results[i].PlayerName.substring(
												0,
												9
											)} - ${results[i].PlayerKills}`
										);
									}
									const message =
										"```" +
										`${PlayerKills[0]}\n${PlayerKills[1]}\n${PlayerKills[2]}\n${PlayerKills[3]}\n${PlayerKills[4]}` +
										"```";
									embed.addFields({
										name: "PlayerKills",
										value: message,
										inline: true,
									});

									connection.query(
										sqlQuery6,
										function (err, results) {
											const DeathByWildDino = [];
											if (err) console.error(err);
											for (
												let i = 0;
												i < results.length;
												i++
											) {
												DeathByWildDino.push(
													`${results[
														i
													].PlayerName.substring(
														0,
														9
													)} - ${
														results[i]
															.DeathByWildDino
													}`
												);
											}
											const message =
												"```" +
												`${DeathByWildDino[0]}\n${DeathByWildDino[1]}\n${DeathByWildDino[2]}\n${DeathByWildDino[3]}\n${DeathByWildDino[4]}` +
												"```";
											embed.addFields({
												name: "DeathByWildDino",
												value: message,
												inline: true,
											});
											channel.messages
												.fetch(messageID)
												.then((message) => {
													message.edit({
														embeds: [embed],
													});
												})
												.catch((err) => {
													createMessage(
														channelID,
														client,
														guildId,
														MsgKey
													);
												});
										}
									);
								}
							);
						});
					});
				});
			});
		}
	},
};
