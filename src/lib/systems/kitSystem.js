const connection = require("../database/sql");
const config = require("../../../config.json");

/**
 * Substracts discord points from user if they have enough
 * @param {string} userid 
 * @param {number} amount 
 * @returns 
 */
function sub_dcpoints(userid, amount) {
	return new Promise((resolve, reject) => {
		// Find the user in the rewardings database
		connection.query(`SELECT * FROM discman.rewardings WHERE userid = "${userid}"`, (err, res) => {
			if (err) throw err;
			// Making sure there is one
			if (res.length < 1) return resolve(false) 
			// Making sure the user has enough points
			if (res[0].points < amount) return resolve(false) 
			// Query to remove points from user
			connection.query(`UPDATE discman.rewardings SET points = ${res[0].points - amount} WHERE userid = "${userid}"`, (err, res) => {
				if (err) throw err
				// If no succes return
				if (!res) return resolve(false) 
				else return resolve(true)
			})
		})
	})
}

/**
 * Adds a specific kit to user in database
 * @param {string} steamId 
 * @param {string} kit 
 * @param {number} amount 
 * @param {string} parentId 
 * @returns {boolean}
 */
function add_kits(steamId, kit, amount, parentId) {
	return new Promise((resolve, reject) => {
		// Deciding what cluster they are on
		let sql_table = ``
        if (parentId == config.info.basicCategory) sql_table = `wshop10x.arkshopplayers`
        if (parentId == config.info.boostedCategory) sql_table = `wshop.arkshopplayers`

		// Find the user in the shop database
		connection.query(`SELECT * FROM ${sql_table} WHERE SteamId = "${steamId}"`, (err, res) => {
			if (err) throw err;
			// Making sure there is one
			
			if (res.length < 1) return resolve(false) 
			// Existing kits object
			let json = JSON.parse(res[0].Kits)
			// If the kit framework is ready
			if (json[kit]) {
				// Adding upon existing amount
				json[kit] = { Amount: json[kit].Amount + amount }
				// Making UPDATE query
				connection.query(`UPDATE ${sql_table} SET Kits = '${JSON.stringify(json)}' WHERE SteamId = "${steamId}"`, (err, res) => {
					if (err) throw err
					if (!res) return resolve(false) 
					else return resolve(true)
				})
			}
			// Else add framework
			else {
				// Adding amount
				json[kit] = { Amount: amount }
				// Making UPDATE query
				connection.query(`UPDATE ${sql_table} SET Kits = '${JSON.stringify(json)}' WHERE SteamId = "${steamId}"`, (err, res) => {
					if (err) throw err
					if (!res) return resolve(false) 
					else return resolve(true)
				})
			}
		})
	})
}

/**
 * Adds points to user in database
 * @param {string} steamId 
 * @param {number} amount 
 * @param {string} parentId 
 * @returns {boolean}
 */
function add_points(steamId, amount, parentId) {
	return new Promise((resolve, reject) => {
		// Deciding what cluster they are on
		let sql_table = ``
        if (parentId == config.info.basicCategory) sql_table = `wshop10x.arkshopplayers`
        if (parentId == config.info.boostedCategory) sql_table = `wshop.arkshopplayers`

		// Find the user in the shop database
		connection.query(`SELECT * FROM ${sql_table} WHERE SteamId = "${steamId}"`, (err, res) => {
			if (err) throw err;
			// Making sure there is a result
			if (res.length < 1) return resolve(false) 
			// Apply points
			connection.query(`UPDATE ${sql_table} SET Points = Points + ${amount} WHERE SteamId = "${steamId}"`, (err, res) => {
				if (err) throw err
				// If no affected row, resolve false
				if (!res) return resolve(false) 
				// If there is a result at all, resolve true
				else return resolve(true)
			})
		})
	})
}

/**
 * get steamid from database
 * @param {string} discordid 
 * @returns {string}
 */
function get_steamid(discordid) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT CAST(steamid AS CHAR) as steamid FROM wdiscordintegrator.discord_integration_players WHERE DiscordID = ${discordid} UNION SELECT CAST(steamid AS CHAR) as steamid FROM wdiscordintegrator10x.discord_integration_players WHERE DiscordID = ${discordid}`, (err, results) => {
            if (results.length <= 0) return resolve(false)
            return resolve(results[0].steamid)
        })
    })
}

/**
 * Get points from user out of the database
 * @param {string} steamId 
 * @param {string} parentId 
 * @returns {string}
 */
function get_points(steamId, parentId) {
	return new Promise((resolve, reject) => {
		// Deciding what cluster they are on
		let sql_table = ``
        if (parentId == config.info.basicCategory) sql_table = `wshop10x.arkshopplayers`
        if (parentId == config.info.boostedCategory) sql_table = `wshop.arkshopplayers`

		// Find the user in the shop database
		connection.query(`SELECT * FROM ${sql_table} WHERE SteamId = "${steamId}"`, (err, res) => {
			if (err) throw err;
			// Making sure there is a result
			if (res.length < 1) return resolve(false) 
			if (!res) return resolve(false) 
			// If there is, Resolve value
			else return resolve(res[0].Points)
			
		})
	})
}

/**
 * get dcpoints from user out of database
 * @param {string} userid 
 * @returns {string}
 */
function get_dcpoints(userid) {
	return new Promise((resolve, reject) => {
		// Find the user in the shop database
		connection.query(`SELECT * FROM discman.rewardings WHERE userid = ${userid}`, (err, res) => {
			if (err) throw err;
			// Making sure there is a result
			if (res.length < 1) return resolve(false) 
			if (!res) return resolve(false) 
			// If there is, Resolve value
			else return resolve(res[0].points)
			
		})
	})
}

module.exports = { add_kits, sub_dcpoints, get_steamid, add_points, get_points, get_dcpoints }
