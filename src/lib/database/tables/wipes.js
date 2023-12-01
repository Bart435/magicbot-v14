const connection = require("../sql");

function discman_wipes() {
	return new Promise((resolve, reject) => {
		const sql = `CREATE TABLE IF NOT EXISTS discman.wipes (
            id BIGINT(20) AUTO_INCREMENT,
            slug VARCHAR(255),
            date VARCHAR(255),
            wipe_timestamp VARCHAR(255),
            last_timestamp VARCHAR(255),
            primary key (id)
        )`;
		connection.query(sql, (err, results) => {
			if (err) reject(err);
			return results.warningCount == "0" ? resolve(0) : resolve(results);
		});
	});
}
module.exports = { discman_wipes };
