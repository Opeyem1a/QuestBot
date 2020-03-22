module.exports = {
  execute(client, message, args) {
      message.channel.send('Pong.');
  },
  enabled: true,
  guildOnly: false,
  aliases: [],
  botPerms: [],
  name: "ping",
  description: "Ping/Pong command. I wonder what this does? /sarcasm",
  usage: "",
  usageDelim: ""
}
