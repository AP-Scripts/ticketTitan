const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder,
  } = require('discord.js');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('setup-ticket')
      .setDescription('Deploys the ticket panel with menu selection'),
  
    async execute(interaction) {
      const embed = new EmbedBuilder()
        .setTitle('🎟️ Create a Ticket')
        .setDescription('Select a category below to open a ticket.')
        .setColor(0xFF0000) // Red theme
        .addFields(
          { name: '🛒 Order Support', value: 'Get help with recent purchases.' },
          { name: '❓ General Questions', value: 'Ask staff anything you need.' },
          { name: '💸 Donations', value: 'Need help with supporting us?' }
        );
  
      const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`ticket_menu_${interaction.user.id}`)
          .setPlaceholder('Choose a ticket type')
          .addOptions([
            {
              label: 'Order Support',
              description: 'Help with a Tebex purchase',
              value: 'order',
              emoji: '🛒',
            },
            {
              label: 'General Question',
              description: 'Ask a question or get help',
              value: 'support',
              emoji: '❓',
            },
            {
              label: 'Donation Inquiry',
              description: 'Questions about donating',
              value: 'donation',
              emoji: '💸',
            },
          ])
      );
  
      await interaction.reply({
        embeds: [embed],
        components: [menu],
      });
    },
  };
  