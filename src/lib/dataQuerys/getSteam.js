const { EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
const { secrets } = require('../../../config.json');
const { get_points } = require('./getPoints');
const { get_groups } = require('./getGroups');
const { get_votes } = require('./getVotes');

async function get_steam(steamId, interaction, target) {
    const parentId = interaction.channel.parent.id
    const votes = await get_votes(steamId, parentId)
    let points = await get_points(steamId, parentId)
    let permission = await get_groups(steamId, parentId)

    try {
        const links = {
            steamUser: "http://api.steampowered.com/ISteamUser",
            playerService: "http://api.steampowered.com/IPlayerService"
        }
        const getPlayer = await fetch(`${links.steamUser}/GetPlayerSummaries/v0002/?key=${secrets.steamapi_key}&steamids=${steamId}`).then(res => res.json()).then(json => json['response']);
        const getOwned = await fetch(`${links.playerService}/GetOwnedGames/v0001/?key=${secrets.steamapi_key}&steamid=${steamId}&format=json`).then(res => res.json()).then(json => json['response']);
        const getFriends = await fetch(`${links.steamUser}/GetFriendList/v0001/?key=${secrets.steamapi_key}&steamid=${steamId}&relationship=friend`).then(res => res.json()).then(json => json);
        const getbans = await fetch(`${links.steamUser}/GetPlayerBans/v0001/?key=${secrets.steamapi_key}&steamids=${steamId}`).then(res => res.json()).then(json => json['players']['0']);
        const badges = await fetch(`${links.playerService}/GetBadges/v0001/?key=${secrets.steamapi_key}&steamid=${steamId}&format=json`).then(res => res.json()).then(json => json['response']);

        const a = getPlayer['players']['0']['timecreated'] * 1000;
        const format = {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric',
        };

        const account = {
            Status: 'Private',
            timeCreated: 'Private',
            gameCount: 'Private',
            totalFriends: 'Private',
            country: 'Private/Not selected',
            gameInfo: 'Private/Not playing',
            steamLevel: 'Private',
            steamXp: 'Private',
            levelProgression: 'Private',
            steamBadges: 'Private'
        }

        const personastate = ['offline', 'online', 'busy', 'away', 'snooze', 'looking to trade', 'looking to play']
        account.Status = personastate[getPlayer['players']['0']['personastate']] !== undefined ? personastate[getPlayer['players']['0']['personastate']] : 0

        if (getPlayer['players']['0']['timecreated']) account.timeCreated = new Date(a).toLocaleString('en-gb', format);
        if (getOwned['game_count']) account.gameCount = getOwned['game_count'];
        if (getFriends['friendslist']) account.totalFriends = getFriends['friendslist']['friends'].length;
        if (getPlayer['players']['0']['loccountrycode']) account.country = getPlayer['players']['0']['loccountrycode'];
        if (getPlayer['players']['0']['gameextrainfo']) account.gameInfo = getPlayer['players']['0']['gameextrainfo'];
        if (badges['player_xp']) {
            account.steamBadges = badges['badges'].length;
            account.steamXp = badges['player_xp'];
            account.steamLevel = badges['player_level'];
        }
        if (points.length >= 1) points = `${points[0].Points}`
        else points = "0"
        if (permission.length >= 1) permission = `${permission[0].PermissionGroups}`
        else permission = "0"

        const succesEmbed = new EmbedBuilder()
            .setTitle(`${getPlayer['players']['0']['personaname']}'s stats (${interaction.user.username})`)
            .addFields(
                { name: 'Status', value: `${account.Status}`, inline: true },
                { name: 'Account created', value: `${account.timeCreated}`, inline: true },
                { name: 'Friends', value: `${account.totalFriends}`, inline: true },
                { name: 'Owned games', value: `${account.gameCount}`, inline: true },
                { name: 'Country', value: `${account.country}` || 'Not Selected', inline: true },
                { name: 'Badges', value: `${account.steamBadges}`, inline: true },
                { name: 'VAC bans', value: `${getbans['NumberOfVACBans']}`, inline: true },
                { name: 'Game bans', value: `${getbans['NumberOfGameBans']}`, inline: true },
                { name: 'Economy bans', value: `${getbans['EconomyBan']}`, inline: true },
                { name: 'Steam Level', value: `${account.steamLevel}`, inline: true },
                { name: 'Steam XP', value: `${account.steamXp}`, inline: true },
                { name: 'Current Playing', value: `${account.gameInfo}`, inline: true },
                { name: 'Shop points', value: `${points}`, inline: true },
                { name: 'Shop groups', value: `${permission}`, inline: true },
                { name: 'votes', value: `${votes.length}`, inline: true }
            )
            .setThumbnail(getPlayer['players']['0']['avatarfull'])
            .setURL(getPlayer['players']['0']['profileurl'])
            .setColor("#8a2be2")
            .setFooter({ text: `Fetched from steam api || ${getPlayer['players']['0']['steamid']}` });
        interaction.reply({ embeds: [succesEmbed], ephemeral: true });
    }
    catch (e) {
        console.log(e)
        interaction.reply({ content: 'could not fetch this steam user', ephemeral: true });
    }
}
module.exports = { get_steam }