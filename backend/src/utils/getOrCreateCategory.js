const { ChannelType } = require('discord.js');

module.exports = async function getOrCreateCategory(guild) {
  let category = guild.channels.cache.find(
    (c) => c.name.toLowerCase() === 'tickets' && c.type === ChannelType.GuildCategory
  );

  if (!category) {
    category = await guild.channels.create({
      name: 'Tickets',
      type: ChannelType.GuildCategory,
    });
  }

  return category.id;
};
