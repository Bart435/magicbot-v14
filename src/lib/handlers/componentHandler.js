const fs = require("fs");
const { setTimeout } = require("timers/promises");

async function loadcomponents(client) {
    const componentFolder = fs.readdirSync("./src/Components");

    for (const folder of componentFolder) {
        const files = fs.readdirSync(`./src/Components/${folder}`).filter((file) => file.endsWith(".js"));
        
        for (const file of files) {
            const component = require(`../../Components/${folder}/${file}`);
            client.components.set(component.customID, component);
        }
    }

    await setTimeout(2000)
    console.log('\x1b[32m%s\x1b[0m', '[Components] Loaded');
}

module.exports = { loadcomponents };

