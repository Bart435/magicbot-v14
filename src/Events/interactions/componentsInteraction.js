const { EmbedBuilder, WebhookClient } = require("discord.js");
const { add_kits, sub_dcpoints, get_steamid, get_points } = require("../../lib/systems/kitSystem");
const { add_tokens } = require("../../lib/systems/tokenSystem")

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if ((interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit())) {

            
            // Kits from the config
            const kits = client.config.kitSystem.kits

            // Cycle through the kits
            for (let i = 0; i < kits.length; i++) {
                // Check if it is a kit interaction
                if (kits[i].name.includes(interaction.customId)) {
                    // Setting the base embeds
                    let errEmbed = new EmbedBuilder().setColor("Red")
                    let sucEmbed = new EmbedBuilder().setColor("Green")
                    let finEmbed = new EmbedBuilder().setColor("Green")

                    // Checking category
                    const parentId = interaction.channel.parent.id

                    // Deciding cluster
                    let cluster = "unknown"
                    if (parentId == client.config.info.basicCategory) cluster = "10x"
                    if (parentId == client.config.info.boostedCategory) cluster = "100x"
                    

                    // If kit has been disabled in the config
                    if (!kits[i].enabled) return interaction.reply( { embeds: [errEmbed.setDescription("This kit is currently unavailable")], ephemeral: true } )

                    // Checking for steam id
                    const steamid = await get_steamid(interaction.user.id)

                    // If steamid is not found in the database
                    if (!steamid) return interaction.reply( { embeds: [errEmbed.setDescription("You must verify your discord first")], ephemeral: true } )
                    
                    // Making sure the player is there
                    const player_is_there = await get_points(steamid, parentId)
                    
                    // if there is no user
                    if (!player_is_there) return interaction.reply( { embeds: [errEmbed.setDescription("You must join our server first before exchange")], ephemeral: true } )

                    // Substacting x amount of discord points
                    const substract = await sub_dcpoints(interaction.user.id, kits[i].price)

                    // If user doesn't have enough points
                    if (!substract) return interaction.reply( { embeds: [errEmbed.setDescription("You don't have enough points to purchase this kit")], ephemeral: true } )
      
                    // Adding x name kit
                    const kit_add = await add_kits(steamid, kits[i].name, kits[i].quantity, parentId)

                    // Incase something goes wrong with applying there kits
                    if (!kit_add) return interaction.reply( { embeds: [errEmbed.setDescription("Make sure you have joined this cluster before purchase")], ephemeral: true } )
                    
                    // Purchase succesfull
                    interaction.reply( { embeds: [sucEmbed.setDescription(`${kits[i].quantity}x ${kits[i].name} has been added to your account. You can find it in your shop`)], ephemeral: true } )

                    // Defining webhook client for logs
                    const webhookClient = new WebhookClient({ url: client.config.kitSystem.webhook });
                    
                    // logging purchase
                    return webhookClient.send({ 
                        embeds: [
                            finEmbed.setTitle("Item Bought")
                            .addFields(
                                {name: "User", value: `${interaction.user.tag}`},
                                {name: "SteamId", value: `${steamid}`},
                                {name: "DiscordId", value: `${interaction.user.id}`},
                                {name: "Item", value: `${kits[i].name}`},
                                {name: "Price", value: `${kits[i].price}`},
                                {name: "Quanity", value: `${kits[i].quantity}`},
                                {name: "Cluster", value: `${cluster}`}
                            )
                        ] 
                    });
                }
        
            }

            // Deciding cluster
            let cluster = false
            if (interaction.channel.parent.id == client.config.info.basicCategory) cluster = "10x"
            if (interaction.channel.parent.id == client.config.info.boostedCategory) cluster = "100x"

            // Filtering out useless reasons to scroll through all this
            if (cluster) {
                const tokens = client.config.tokenSystem[cluster]
                for (let i = 0; i < tokens.length; i++) {
                    if (tokens[i].name.includes(interaction.customId)) {
                        // Setting the base embeds
                        let errEmbed = new EmbedBuilder().setColor("Red")
                        let sucEmbed = new EmbedBuilder().setColor("Green")
                        let finEmbed = new EmbedBuilder().setColor("Green")

                        // If token has been disabled in the config
                        if (!tokens[i].enabled) return interaction.reply( { embeds: [errEmbed.setDescription("This token is currently unavailable")], ephemeral: true } )

                        // Checking for steam id
                        const steamid = await get_steamid(interaction.user.id)

                        // If steamid is not found in the database
                        if (!steamid) return interaction.reply( { embeds: [errEmbed.setDescription("You must verify your discord first")], ephemeral: true } )

                        // Substacting x amount of discord points
                        const substract = await sub_dcpoints(interaction.user.id, tokens[i].price)
                        
                        // If user doesn't have enough points
                        if (!substract) return interaction.reply( { embeds: [errEmbed.setDescription("You don't have enough points to purchase this token")], ephemeral: true } )

                        // Adding x name tokens
                        const token_add = await add_tokens(steamid, tokens[i].quantity, interaction.customId, interaction.channel.parent.id)

                        // Incase something goes wrong with applying there tokens
                        if (!token_add) return interaction.reply( { embeds: [errEmbed.setDescription("Make sure you have joined this cluster before purchase")], ephemeral: true } )


                        // Purchase succesfull
                        interaction.reply( { embeds: [sucEmbed.setDescription(`${tokens[i].quantity}x ${tokens[i].name} has been added to your account`)], ephemeral: true } )

                        // Defining webhook client for logs
                        const webhookClient = new WebhookClient({ url: client.config.tokenSystem.webhook });
                        
                        // logging purchase
                        return webhookClient.send({ 
                            embeds: [
                                finEmbed.setTitle("Item Bought")
                                .addFields(
                                    {name: "User", value: `${interaction.user.tag}`},
                                    {name: "SteamId", value: `${steamid}`},
                                    {name: "DiscordId", value: `${interaction.user.id}`},
                                    {name: "Item", value: `${tokens[i].name}`},
                                    {name: "Price", value: `${tokens[i].price}`},
                                    {name: "Quanity", value: `${tokens[i].quantity}`},
                                    {name: "Cluster", value: `${cluster}`}
                                )
                            ] 
                        });
                    }
                }
            }

            const component = client.components.get(interaction.customId);

            if (!component) return interaction.reply({ content: "This component is outdated!" });

            component.execute(interaction, client);
            
        }
    },
}