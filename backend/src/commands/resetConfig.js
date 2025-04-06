const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset-config')
    .setDescription('Resets config.json to default values'),

  async execute(interaction) {
    const defaultConfig = {
      logChannel: "",
      ticketCategory: "",
      verifiedRole: "",
      unverifiedRole: "",
      protectedUsers: [],
      cooldowns: { verify: 10 }
    };

    const filePath = path.join(__dirname, '../../config.json');
    fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2));

    await interaction.reply({ content: '✅ Config has been reset to default.', ephemeral: true });
  }
};
