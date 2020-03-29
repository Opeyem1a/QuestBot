const { prefix, name } = require('../config.json');
const { Permissions } = require('discord.js');
const { botNoPerms } = require('../responses.json');
const { hasPermLevel } = require('../Functions/permlevel.js');

module.exports = {
  handle(client, message) {
    //if the message doesn't have the unique prefix or is another bot, stop
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    //args is an array of everything the user typed, besides the prefix
  	const args = message.content.slice(prefix.length).split(/ +/);
    //command is the name of the command they called. This shifts args so args only contains the arguments
  	const commandName = args.shift().toLowerCase();
    //is that's not a loaded command, stop
    if (!client.commands.has(commandName) && !client.aliases.has(commandName)) return;

    var command;
    if(client.commands.has(commandName)){
      command = client.commands.get(commandName);
    } else {
      command = client.aliases.get(commandName);
    }

    //if the bot does not have the required permissions to complete this command, stop
    if(!message.guild.me.hasPermission(command.botPerms)) {
      console.log(`Insufficient bot permissions to run command: ${commandName}`);
      message.channel.send(botNoPerms);
      return;
    }

    if(!hasPermLevel(message.member, command.userPermLevel)) {
      console.log(`Insufficient user permissions to run command: ${commandName}`);
      message.channel.send(iserNoPerms);
      return;
    }

    //run this command
    try {
      command.execute(client, message, args);
    } catch (error) {
    	console.error(error);
    	message.reply(`The command ${commandName} could not be executed.`);
    }
  }
}
