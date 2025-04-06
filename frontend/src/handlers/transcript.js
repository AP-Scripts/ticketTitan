const fs = require('fs');
const path = require('path');

module.exports = async function saveTranscript(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });
  const sorted = [...messages.values()].reverse();

  let content = `Transcript for ${channel.name}\n\n`;

  for (const msg of sorted) {
    content += `[${msg.createdAt.toISOString()}] ${msg.author.tag}: ${msg.cleanContent || '[embed/attachment]'}\n`;
  }

  const transcriptsDir = path.join(__dirname, '../../transcripts');
  if (!fs.existsSync(transcriptsDir)) fs.mkdirSync(transcriptsDir);

  const filePath = path.join(transcriptsDir, `${channel.name}.txt`);
  fs.writeFileSync(filePath, content);

  return filePath;
};
