const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Displays the current config.json values'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🛠 Ticket Titan Config')
      .setColor(0xff0000)
      .addFields(
        { name: 'Log Channel', value: config.logChannel || 'Not Set', inline: true },
        { name: 'Ticket Category', value: config.ticketCategory || 'Not Set', inline: true },
        { name: 'Verified Role', value: config.verifiedRole || 'Not Set', inline: true },
        { name: 'Unverified Role', value: config.unverifiedRole || 'Not Set', inline: true },
        { name: 'Protected Users', value: config.protectedUsers.length ? config.protectedUsers.join(', ') : 'None' },
        { name: 'Verify Cooldown (s)', value: config.cooldowns.verify.toString(), inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
