const express = require('express');
const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const client = require('./index'); // reference to your bot

const router = express.Router();
const configPath = path.join(__dirname, '../config.json');

// ✅ Middleware to require login (from passport session)
function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(403).json({ error: 'Unauthorized' });
}

// ✅ GET /api/config
router.get('/config', requireAuth, (req, res) => {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read config.json' });
  }
});

// ✅ POST /api/config
router.post('/config', requireAuth, (req, res) => {
  try {
    const newConfig = req.body;
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write config.json' });
  }
});

// ✅ POST /api/embed
router.post('/embed', requireAuth, async (req, res) => {
  const { title, description, footer, channelId } = req.body;

  if (!title || !description || !channelId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      return res.status(404).json({ error: 'Invalid channel ID or not a text channel' });
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(0xff0000)
      .setTimestamp();

    if (footer) embed.setFooter({ text: footer });

    await channel.send({ embeds: [embed] });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Failed to send embed:', err);
    return res.status(500).json({ error: 'Could not send embed' });
  }
});

// ✅ GET /api/tebex-logs
router.get('/tebex-logs', requireAuth, (req, res) => {
  const logPath = path.join(__dirname, '../tebex.log');
  try {
    const content = fs.readFileSync(logPath, 'utf8');
    const logs = content.split('\n').filter(Boolean).reverse();
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read tebex.log' });
  }
});

module.exports = router;
