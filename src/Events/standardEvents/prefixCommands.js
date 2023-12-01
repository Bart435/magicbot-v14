const connection = require("../../lib/database/sql")
const { setTimeout } = require("timers/promises");
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (!message.content.startsWith(client.config.info.prefix)) return;
        const args = message.content.slice(client.config.info.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.prefixCommands.has(command)) return;
        
        connection.query(`SELECT * from discman.admin WHERE userid = ${message.author.id}`, (err, results) => {
            if (err) throw err;
            if (results <= 0) return message.reply("You must be admin to perform this command.")
            try {
                client.prefixCommands.get(command).execute(message, client, args);
                connection.query(`INSERT INTO discman.commands_used (guildid, channelid, command, userid) VALUES ('${message.guildId}', '${message.channelId}', '${command}', '${message.author.id}')`, (err) => {
                    if (err) throw err;
                })
                
            } catch (error) {
                console.log(error)
                message.reply('there was an error trying to execute that command!');
            }
            
        })
        await setTimeout(2000)
        message.delete();
    },
};

