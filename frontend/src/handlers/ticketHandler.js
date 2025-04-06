const {
    ChannelType,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require('discord.js');
  const getOrCreateCategory = require('../utils/getOrCreateCategory');
  const saveTranscript = require('./transcript');
  
  module.exports = {
    async createTicket(interaction) {
      const selected = interaction.values[0]; // e.g., "order", "support"
      const categoryId = await getOrCreateCategory(interaction.guild);
  
      const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`.toLowerCase(),
        type: ChannelType.GuildText,
        parent: categoryId,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
          },
          {
            id: interaction.client.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
          },
        ],
      });
  
      const closeBtn = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Close Ticket')
          .setStyle(ButtonStyle.Danger)
      );
  
      await ticketChannel.send({
        content: `🎟 Ticket created by <@${interaction.user.id}> — **Type:** ${selected}`,
        components: [closeBtn],
      });
  
      await interaction.reply({
        content: `✅ Ticket created: ${ticketChannel}`,
        ephemeral: true,
      });
    },
  
    async handleButton(interaction) {
      if (interaction.customId === 'close_ticket') {
        await interaction.reply({
          content: 'Are you sure you want to close this ticket?',
          ephemeral: true,
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId('confirm_close')
                .setLabel('Yes, close it')
                .setStyle(ButtonStyle.Danger)
            ),
          ],
        });
      }
  
      if (interaction.customId === 'confirm_close') {
        const channel = interaction.channel;
  
        // Save transcript before deleting
        const filePath = await saveTranscript(channel);
  
        // Send to log channel (optional: replace with actual channel ID)
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (logChannelId) {
          const logChannel = await interaction.guild.channels.fetch(logChannelId).catch(() => null);
          if (logChannel) {
            await logChannel.send({
              content: `📝 Transcript from ${channel.name}`,
              files: [filePath],
            });
          }
        }
  
        await interaction.reply({ content: '📁 Saving transcript and closing ticket...', ephemeral: true });
        setTimeout(() => {
          channel.delete().catch(console.error);
        }, 3000);
      }
    },
  };
  