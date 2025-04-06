const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require('discord.js');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('setup-verify')
      .setDescription('Posts the verification button panel')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  
    async execute(interaction) {
      const embed = new EmbedBuilder()
        .setTitle('✅ Verify Yourself')
        .setDescription('Click the button below to verify and unlock the server!')
        .setColor(0xff0000);
  
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_btn')
          .setLabel('Verify Me')
          .setStyle(ButtonStyle.Success)
      );
  
      await interaction.reply({
        content: 'Verification panel posted:',
        ephemeral: true,
      });
  
      await interaction.channel.send({ embeds: [embed], components: [row] });
    },
  };
  