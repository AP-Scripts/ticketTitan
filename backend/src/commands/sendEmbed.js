const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
  } = require('discord.js');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('send-embed')
      .setDescription('Send a styled embed to a selected channel')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .addChannelOption(option =>
        option
          .setName('channel')
          .setDescription('Channel to send the embed to')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('title').setDescription('Embed title').setRequired(true)
      )
      .addStringOption(option =>
        option.setName('description').setDescription('Embed description').setRequired(true)
      )
      .addStringOption(option =>
        option.setName('footer').setDescription('Embed footer text').setRequired(false)
      ),
  
    async execute(interaction) {
      const channel = interaction.options.getChannel('channel');
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const footer = interaction.options.getString('footer');
  
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(0xff0000)
        .setTimestamp();
  
      if (footer) {
        embed.setFooter({ text: footer });
      }
  
      await channel.send({ embeds: [embed] });
  
      await interaction.reply({
        content: `✅ Embed sent to ${channel}`,
        ephemeral: true,
      });
    },
  };
  