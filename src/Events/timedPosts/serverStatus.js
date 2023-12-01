const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const connection = require("../../lib/database/sql");
const { Server } = require("@fabricio-191/valve-server-query");
const { createMessage } = require("../../lib/events/createMessage");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		let timer = setInterval(async function () {
			const sqlQuery = `SELECT * FROM discman.posts WHERE slug = 'serverStatus'`;
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
					setserverstatus(
						messageID,
						channelID,
						client,
						guildId,
						MsgKey
					);
				}
			});
		}, 120000);

		async function setserverstatus(
			messageID,
			channelID,
			client,
			guildId,
			MsgKey
		) {
			const channel = client.channels.cache.get(channelID);
			if (!channel) {
				const sqlQuery = `DELETE FROM discman.posts WHERE channelid = ${channelID} AND guildid = ${guildId} AND slug = "${MsgKey}"`;
				return connection.query(sqlQuery, function (err) {
					if (err) throw err;
				});
			}
			const image = new AttachmentBuilder("./src/lib/assets/500x500.png");
			const banner = new AttachmentBuilder(
				"./src/lib/assets/banners/Artboard_11.png"
			);

			let embed = new EmbedBuilder()
				.setTitle("__server status__")
				.setDescription("Status and player counter for all our servers")
				.setFooter({
					text: client.config.info.embed.footer,
				})
				.setThumbnail("attachment://500x500.png")
				.setImage("attachment://Artboard_11.png")
				.setTimestamp()
				.setColor(client.config.info.embed.color);

			const servers = client.config.servers["100x"];
			let total_players = [];

			async function players_(server_ip, server_port) {
				try {
					const server_con = await Server({
						ip: server_ip,
						port: server_port,
						timeout: 3000,
					});
					const players = await server_con.getPlayers();
					server_con.disconnect();
					return players;
				} catch (err) {
					return "offline";
				}
			}

			for (let i = 0; i < servers.length; i++) {
				if (!servers[i].enabled) continue;

				let server_ip = servers[i].ip;
				let server_port = servers[i].queryPort;
				const players = await players_(server_ip, server_port);

				let players_new = [];
				if (players != "offline") {
					for (let b = 0; b < players.length; b++) {
						if (players[b].name.length == 0) continue;
						total_players.push(players[b].name);
						let value = " `" + players[b].name + "`";
						players_new.push(value);
					}
				}
				const counter = players_new.length;
				if (players_new.length == 0) players_new = false;
				embed.addFields({
					name: servers[i].name,
					value: `${
						players != "offline"
							? `✅ Players ${counter}\n`
							: "❌ Offline\n"
					} ${
						players_new.length > 0
							? `${players_new.toString()}\n`
							: ""
					}└[connect](${servers[i].url})`,
					inline: true,
				});
			}

			embed.addFields({
				name: "Online Players",
				value: `🌐 ${total_players.length}`,
			});
			// client.user.setPresence({ activities: [{ name: `🌐 Online Players: ${total_players.length}` }] });
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
