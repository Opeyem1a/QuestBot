module.exports = {
  execute(client, message, args) {
      message.channel.send('Pong.');
  },

  enabled: true,
  guildOnly: false,
  aliases: [],
  userPermLevel: 3,
  botPerms: ['MANAGE_MESSAGES'],
  name: "ping",
  description: "Ping/Pong command. I wonder what this does? /sarcasm",
  usage: ""
}
