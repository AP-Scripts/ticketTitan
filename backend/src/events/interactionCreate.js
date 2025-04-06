const ticketHandler = require('../handlers/ticketHandler');
const config = require('../../config.json');

// Cooldown map defined outside so it persists across interactions
const cooldowns = new Map();

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    // ✅ Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        await interaction.reply({ content: '❌ There was an error executing that command.', ephemeral: true });
      }
    }

    // ✅ Select Menus (ticket category selection)
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId.startsWith('ticket_menu')) {
        return ticketHandler.createTicket(interaction);
      }
    }

    // ✅ Buttons (verify button or ticket close buttons)
    if (interaction.isButton()) {
      // Handle the verify button
      if (interaction.customId === 'verify_btn') {
        const member = interaction.member;

        // Auto-bypass for staff
        if (member.permissions.has('KickMembers')) {
          await member.roles.add(config.verifiedRole).catch(console.error);
          await member.roles.remove(config.unverifiedRole).catch(() => {});
          return interaction.reply({ content: '✅ You’ve been auto-verified (staff).', ephemeral: true });
        }

        // Cooldown check
        const cd = cooldowns.get(member.id);
        const now = Date.now();
        if (cd && now - cd < config.cooldowns.verify * 1000) {
          const remaining = ((config.cooldowns.verify * 1000 - (now - cd)) / 1000).toFixed(1);
          return interaction.reply({ content: `⏳ Please wait ${remaining}s before verifying again.`, ephemeral: true });
        }

        cooldowns.set(member.id, now);

        try {
          await member.roles.add(config.verifiedRole);
          await member.roles.remove(config.unverifiedRole).catch(() => {});
          await interaction.reply({ content: '✅ You have been verified!', ephemeral: true });
          await member.send(`🎉 You are now verified in **${interaction.guild.name}**!`).catch(() => {});
        } catch (err) {
          console.error(err);
          await interaction.reply({ content: '❌ Could not verify you. Please contact staff.', ephemeral: true });
        }

        return;
      }

      // Pass other buttons (like close ticket) to the handler
      return ticketHandler.handleButton(interaction);
    }
  });
};
