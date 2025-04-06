const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('order-check')
    .setDescription('Check the status of a Tebex order')
    .addStringOption(option =>
      option.setName('transaction_id')
        .setDescription('Enter your Tebex transaction ID')
        .setRequired(true)
    ),

  async execute(interaction) {
    const txID = interaction.options.getString('transaction_id');

    try {
      const response = await axios.get(`https://plugin.tebex.io/payments/${txID}`, {
        headers: { 'X-Tebex-Secret': process.env.TEBEX_SECRET }
      });

      const data = response.data;
      const embed = new EmbedBuilder()
        .setTitle('🛒 Tebex Order Status')
        .addFields(
          { name: 'Transaction ID', value: data.transaction.id },
          { name: 'User', value: data.player.name },
          { name: 'Status', value: data.status },
          { name: 'Amount', value: `${data.amount} ${data.currency}` }
        )
        .setColor(0x00ff00)
        .setFooter({ text: 'Thank you for supporting!' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Could not find a transaction with that ID.', ephemeral: true });
    }
  }
};
