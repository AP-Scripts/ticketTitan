const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');
require('dotenv').config();

const app = express();
app.use(express.json());

// Tebex webhook listener
app.post('/tebex', async (req, res) => {
  const secret = req.headers['x-tebex-signature'];
  const expected = process.env.TEBEX_SECRET;

  if (!secret || secret !== expected) {
    return res.status(401).send('Unauthorized');
  }

  const payload = req.body;

  const logLine = `[${new Date().toISOString()}] ${payload.player.name} | ${payload.transaction.id} | ${payload.status}`;
  console.log(logLine);

  // Save to log file
  const logFile = path.join(__dirname, '../tebex.log');
  fs.appendFileSync(logFile, logLine + '\n');

  // Send to Discord
  try {
    const client = require('./index'); // Import the Discord bot client
    const logChannel = await client.channels.fetch(config.logChannel).catch(() => null);

    if (logChannel) {
      await logChannel.send({
        content: `🛒 **Tebex Payment Received**\n**User:** ${payload.player.name}\n**Amount:** ${payload.amount} ${payload.currency}\n**Status:** ${payload.status}`
      });
    }
  } catch (err) {
    console.error('❌ Failed to send Discord log:', err);
  }

  return res.status(200).send('Received');
});

module.exports = app;
