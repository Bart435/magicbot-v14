const connection = require("../database/sql");
const { apply_DCpoints } = require("../dataQuerys/addDcPoints");

// Compares discord and database invites for increase and fires when true
function comparing_invites(client) {
	client.guilds.cache
		.get(client.config.info.mainGuild)
		.invites.fetch()
		.then((invites) => {
			invites.each((inv) => {
				// connection.query(`INSERT INTO discman.invites (code, uses, inviterId, createdTimestamp, _expiresTimestamp) VALUES ('${inv.code}', ${inv.uses}, ${inv.inviterId}, ${inv.createdTimestamp}, ${inv.expiresTimestamp})`, (err) => {if (err) throw err})
				connection.query(
					`SELECT CAST(inviterId AS CHAR) as inviterId, uses, code FROM discman.invites WHERE code = '${inv.code}'`,
					(err, res) => {
						// Checks if the invites in the database are smaller than discords returns
						if (res[0].uses < inv.uses) {
							const userid = res[0].inviterId;
							const amount = client.config.inviteSystem.amount;
							// applies DC points
							apply_DCpoints(userid, amount, client);
							// Updates the database
							connection.query(
								`UPDATE discman.invites SET uses = ${inv.uses} WHERE code = '${inv.code}'`,
								(err) => {
									if (err) throw err;
								}
							);
						}
					}
				);
			});
		});
}

// Removes expired discord invites from database
function remove_expired() {
	connection.query(
		"SELECT id, _expiresTimestamp FROM discman.invites",
		(err, res) => {
			if (err) throw err;
			for (let i = 0; i < res.length; i++) {
				// If time is infite, it returns
				if (!res[i]._expiresTimestamp) continue;

				// Check timestamp now
				const now = new Date().getTime();

				// Compares the 2 if it exceded
				if (now > res[i]._expiresTimestamp) {
					// if so it removed the invite from the database
					connection.query(
						`DELETE FROM discman.invites WHERE id = ${res[i].id}`,
						(err) => {
							if (err) throw err;
						}
					);
				}
			}
		}
	);
}

// Removes manually removed discord invites by comparing discord and database results
function remove_invites(client) {
	client.guilds.cache
		.get(client.config.info.mainGuild)
		.invites.fetch()
		.then((invites) => {
			// Creating arrays
			let client_invites = [];
			let db_invites = [];

			// Pushing discord invites into array
			invites.each((inv) => {
				client_invites.push(inv.code);
			});

			connection.query("SELECT code FROM discman.invites", (err, res) => {
				// pushing database invites into array
				for (let i = 0; i < res.length; i++) {
					db_invites.push(res[i].code);
				}

				// Comparing for differences
				let difference = db_invites.filter(
					(x) => !client_invites.includes(x)
				);

				// Deletes difference in database if any
				if (difference.length > 0) {
					difference.forEach((l) => {
						connection.query(
							`DELETE FROM discman.invites WHERE code  = '${l}'`,
							(err) => {
								if (err) throw err;
							}
						);
					});
				}
			});
		});
}

module.exports = { comparing_invites, remove_expired, remove_invites };
