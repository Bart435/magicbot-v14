const { get_steamid } = require("../../lib/dataQuerys/getSteamid");
const { add_group } = require("../../lib/dataQuerys/addGroup");
const { remove_group } = require("../../lib/dataQuerys/removeGroup");

module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember, client) {
        if (!oldMember.guild.id || !newMember.guild.id == client.config.info.mainGuild) return
        const group = client.config.boosterSystem.group
        const discordid = oldMember.user.id || newMember.user.id
        const old = oldMember.premiumSince;
        const ne = newMember.premiumSince;
        
        const steamid = await get_steamid(discordid)
        const webhook = client.config.boosterSystem.webhook

        if (!old && ne) {
            if (!steamid) return
            add_group(steamid, group, webhook, client)
        }
        if (old && !ne) {
            if (!steamid) return
            remove_group(steamid, group, webhook, client)
        }

        if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
            if (!oldMember.roles.cache.has(client.config.info.verifiedRole) && newMember.roles.cache.has(client.config.info.verifiedRole)) {
                if (old && ne) {
                    if (!steamid) return
                    add_group(steamid, group, webhook, client)
                }
            }
            if (oldMember.roles.cache.has(client.config.info.verifiedRole) && !newMember.roles.cache.has(client.config.info.verifiedRole)) {
                if (!steamid) return
                remove_group(steamid, group, webhook, client)
            }
        }
    },
};

