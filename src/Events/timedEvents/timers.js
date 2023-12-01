const {
	EmbedBuilder,
	WebhookClient,
	ActivityType,
	Client,
} = require("discord.js");
const connection = require("../../lib/database/sql");
const {
	apply_points,
	apply_points10x,
} = require("../../lib/dataQuerys/addPoints");
const { addVotes, addVotes10x } = require("../../lib/timedFunctions/addVotes");
const { autoUnmute } = require("../../lib/timedFunctions/autoUnmute");
const { google } = require("googleapis");
const superagent = require("superagent");

module.exports = {
	name: "ready",
	once: true,
	/**
	 *
	 * @param {Client} client
	 */
	async execute(client) {
		let timer = setInterval(async function () {
			connection.query(`SELECT * FROM discman.votes`, (err, results) => {
				if (err) throw err;
				for (let i = 0; i < results.length; i++) {
					let steamid = results[i].steamid;
					if (results[i].claimed !== 1) {
						let amount = client.config.voteSystem.amount;
						let x = 1;
						apply_points(steamid, amount, client, x);
					}
				}
			});

			connection.query(
				`SELECT * FROM discman.votes10x`,
				(err, results) => {
					if (err) throw err;
					for (let i = 0; i < results.length; i++) {
						let steamid = results[i].steamid;
						if (results[i].claimed !== 1) {
							let amount = client.config.voteSystem.amount10x;
							let x = 1;
							apply_points10x(steamid, amount, client, x);
						}
					}
				}
			);
		}, 60000);

		let timer2 = setInterval(function () {
			autoUnmute(client);

			const servers100x = client.config.servers["100x"];
			const servers10x = client.config.servers["10x"];

			for (let i = 0; i < servers100x.length; i++) {
				if (!servers100x[i].enabled) continue;
				let votersURL = client.config.voteSystem.url.replace(
					"{ServerKey}",
					`${servers100x[i].key}`
				);
				addVotes(votersURL, client);
			}

			for (let i = 0; i < servers10x.length; i++) {
				if (!servers10x[i].enabled) continue;
				let votersURL = client.config.voteSystem.url.replace(
					"{ServerKey}",
					`${servers10x[i].key}`
				);
				addVotes10x(votersURL, client);
			}
		}, 60000);

		let totalCount = setInterval(async function () {
			try {
				const guild = client.guilds.cache.get(
					client.config.info.mainGuild
				);
				const memberCount = guild.memberCount;
				const channelTotal = guild.channels.cache.get(
					client.config.discordStatus.total.channelid
				);
				const channelBasic = guild.channels.cache.get(
					client.config.discordStatus.basic.channelid
				);
				const channelBoosted = guild.channels.cache.get(
					client.config.discordStatus.boosted.channelid
				);
				const channelModding = guild.channels.cache.get(
					client.config.discordStatus.modding.channelid
				);

				let basicCount = [];
				let boostedCount = [];
				let moddingCount = [];

				const members = await guild.members.fetch();
				members.each((member) => {
					if (
						member.roles.cache.has(
							client.config.discordStatus.basic.roleId
						)
					)
						basicCount.push(member.user.username);
					if (
						member.roles.cache.has(
							client.config.discordStatus.boosted.roleId
						)
					)
						boostedCount.push(member.user.username);
					if (
						member.roles.cache.has(
							client.config.discordStatus.modding.roleId
						)
					)
						moddingCount.push(member.user.username);
				});

				channelTotal.setName(
					client.config.discordStatus.total.name.replace(
						"{members}",
						memberCount.toLocaleString()
					)
				);
				channelBasic.setName(
					client.config.discordStatus.basic.name.replace(
						"{members}",
						basicCount.length.toLocaleString()
					)
				);
				channelBoosted.setName(
					client.config.discordStatus.boosted.name.replace(
						"{members}",
						boostedCount.length.toLocaleString()
					)
				);
				channelModding.setName(
					client.config.discordStatus.modding.name.replace(
						"{members}",
						moddingCount.length.toLocaleString()
					)
				);
			} catch (error) {
				console.log(error);
			}
		}, client.config.discordStatus.refresh);

		let creators_timer = setInterval(async function () {
			connection.query(`SELECT * FROM discman.creators`, (err, res) => {
				if (err) throw err;
				for (let i = 0; i < res.length; i++) {
					const now = Date.now();
					const expire = res[i].end_timestamp;
					if (now > expire) {
						connection.query(
							`DELETE FROM discman.creators WHERE channelId = '${res[i].channelId}'`,
							(err, results) => {
								if (err) throw err;
							}
						);
						const backendWebhookClient = new WebhookClient({
							url: client.config.creatorSystem.webhook_backend,
						});
						const embed = new EmbedBuilder()
							.setColor("red")
							.setDescription(
								`${res[i].channelURL}\nHis partnership has expired. Please re-add when you wish`
							);
						return backendWebhookClient.send({ embeds: [embed] });
					}
					videoPost(client, res[i].channelId, res[i].latestVideoId);
				}
			});
			async function videoPost(client, channelId, latestVideoId) {
				const youtube = google.youtube({
					version: "v3",
					auth: client.config.secrets.youtubeapi_key,
				});

				const response = await youtube.channels.list({
					id: channelId,
					part: "contentDetails",
				});

				const playlistId =
					response.data.items[0].contentDetails.relatedPlaylists
						.uploads;

				const playlistItemsResponse = await youtube.playlistItems.list({
					playlistId,
					part: "snippet",
					maxResults: 1,
				});

				let channelName =
					playlistItemsResponse.data.items[0].snippet.channelTitle;
				let videoTitle =
					playlistItemsResponse.data.items[0].snippet.title;
				let videoId =
					playlistItemsResponse.data.items[0].snippet.resourceId
						.videoId;
				let videoURL = `https://www.youtube.com/watch?v=${videoId}`;

				if (videoId == latestVideoId) return;

				try {
					const webhookClient = new WebhookClient({
						url: client.config.creatorSystem.webhook,
					});
					const backendWebhookClient = new WebhookClient({
						url: client.config.creatorSystem.webhook_backend,
					});

					webhookClient
						.send({
							content: `@everyon ${channelName} just released a new video. Go check him out!\n${videoURL}`,
						})
						.then(() => {
							connection.query(
								`UPDATE discman.creators SET latestVideoId = '${videoId}' WHERE channelId = '${channelId}'`,
								(err, results) => {
									if (err) throw err;
									const embed2 = new EmbedBuilder()
										.setColor("Green")
										.setDescription(
											`${channelName}'s newest video has been posted`
										);
									backendWebhookClient.send({
										embeds: [embed2],
									});
								}
							);
						});
				} catch (error) {}
			}
		}, client.config.creatorSystem.refresh);
	},
};
