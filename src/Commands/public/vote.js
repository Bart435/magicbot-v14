const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Provides url's to ark-servers.net")
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    const image = new AttachmentBuilder('./src/lib/assets/500x500.png')

    const response = new EmbedBuilder()
      .setTitle("Vote url's")
      .setColor(client.config.info.embed.color)
      .setDescription("Clicking the map name will redirect you to the vote website.")
      .setThumbnail("attachment://500x500.png")
      .addFields(
        { name: "‎‎‏", value: "[Ragnarok](https://ark-servers.net/server/316983/)\n[The Island](https://ark-servers.net/server/316987/)\n[The Center](https://ark-servers.net/server/316984/)\n", inline: true },
        { name: "‎‎‏", value: "[Fjordur](https://ark-servers.net/server/316988/)\n[Valguero](https://ark-servers.net/server/316986/)\n[Aberration](https://ark-servers.net/server/319074/)\n", inline: true },
        { name: "‎‎‏", value: "[Genesis 2](https://ark-servers.net/server/316989/)\n[Extinction](https://ark-servers.net/server/319078/)", inline: true },
        { name: "Group", value: "[MagicArk 100x](https://ark-servers.net/group/1197/)" }
      )
    interaction.reply({ embeds: [response], files: [image], ephemeral: true });
  },
};