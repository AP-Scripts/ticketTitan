const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path'); // ✅ Required for frontend serving
require('dotenv').config();

const config = require('../config.json');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Load event: interactionCreate
require('./events/interactionCreate')(client);

// ✅ Protected Ping Blocking
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const mentionedIds = message.mentions.users.map(u => u.id);
  const protectedList = config.protectedUsers || [];

  if (mentionedIds.some(id => protectedList.includes(id))) {
    if (message.member.permissions.has('KickMembers')) return;

    await message.delete().catch(() => {});
    const warn = await message.channel.send({
      content: `🚫 <@${message.author.id}>, you cannot mention protected users.`,
    });
    setTimeout(() => warn.delete().catch(() => {}), 5000);
  }
});

client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

// ✅ Unified Express App (Tebex + API + Auth + Frontend)
const express = require('express');
const app = express();
const setupAuth = require('./auth');
const tebexWebhook = require('./tebexWebhook');
const apiRoutes = require('./apiRoutes');

app.use(express.json());

// 🔐 Setup Discord OAuth
setupAuth(app);

// ✅ Routes
app.use('/tebex', tebexWebhook);
app.use('/api', apiRoutes);

// ✅ Serve frontend dashboard from /frontend/dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// 🌐 Start the web server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌐 Express server running on http://localhost:${PORT}`);
});

// Export the bot client
module.exports = client;

// 🔐 Login the bot
client.login(process.env.BOT_TOKEN);

