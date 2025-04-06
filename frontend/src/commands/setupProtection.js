const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');
let config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-protection')
    .setDescription('Add or remove protected user IDs')
    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('Add a protected user')
        .addStringOption(option =>
          option.setName('userid').setDescription('Discord user ID to protect').setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('Remove a protected user')
        .addStringOption(option =>
          option.setName('userid').setDescription('Discord user ID to unprotect').setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('list').setDescription('List all protected users')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
      const userId = interaction.options.getString('userid');
      if (config.protectedUsers.includes(userId)) {
        return interaction.reply({ content: '⚠️ This user is already protected.', ephemeral: true });
      }
      config.protectedUsers.push(userId);
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      return interaction.reply({ content: `✅ User <@${userId}> has been protected.`, ephemeral: true });
    }

    if (sub === 'remove') {
      const userId = interaction.options.getString('userid');
      config.protectedUsers = config.protectedUsers.filter(id => id !== userId);
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      return interaction.reply({ content: `✅ User <@${userId}> has been removed from protection.`, ephemeral: true });
    }

    if (sub === 'list') {
      const list = config.protectedUsers.map(id => `<@${id}>`).join('\n') || 'None';
      return interaction.reply({ content: `👑 Protected Users:\n${list}`, ephemeral: true });
    }
  }
};
