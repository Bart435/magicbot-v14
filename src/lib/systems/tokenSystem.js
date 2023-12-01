const connection = require("../database/sql");
const config = require("../../../config.json");



// adds tokens to user in database | steamid(str), amount(int), type(str), parentId(str)
function add_tokens(steamId, amount, type, parentId) {
	return new Promise((resolve, reject) => {
		// Deciding what cluster they are on
		let sql_table = false
        if (parentId == config.info.basicCategory) sql_table = `tokenbank10x.players`
        if (parentId == config.info.boostedCategory) sql_table = `tokenbank.players`

        // Incase it's used outside the scope
        if (!sql_table) return resolve(false)

		// Find the user in the shop database
		connection.query(`SELECT * FROM ${sql_table} WHERE SteamId = ${steamId} AND TokenType = '${type}'`, (err, res) => {
			if (err) throw err;
			// Making sure there is a result
			if (res.length < 1) {
                // Insert type
                connection.query(`INSERT INTO ${sql_table} (SteamId, Tokens, TokenType) VALUES (${steamId}, ${amount}, '${type}')`, (err, res) => {
                    if (err) throw err
                    // If no affected row, resolve false
                    if (!res) resolve(false) 
                    // If there is a result at all, resolve true
                    else resolve(true)
                })
            } else {
                // Apply tokens
                connection.query(`UPDATE ${sql_table} SET Tokens = Tokens + ${amount} WHERE SteamId = ${steamId} AND TokenType = '${type}'`, (err, res) => {
                    if (err) throw err
                    // If no affected row, resolve false
                    if (!res) resolve(false) 
                    // If there is a result at all, resolve true
                    else resolve(true)
                })
            }
		})
	})
}

module.exports = { add_tokens }