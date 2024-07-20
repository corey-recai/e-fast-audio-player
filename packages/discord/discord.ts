async function getThreadMP3s(channelId, token) {
  const response = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/messages`,
    {
      headers: {
        Authorization: `Bot ${token}`,
      },
    }
  );
  const messages = await response.json();

  const mp3Messages = messages.filter(message => {
    if (!message.attachments) return false;
    return message.attachments.some(attachment =>
      attachment.filename.endsWith(".mp3")
    );
  });

  return mp3Messages;
}
