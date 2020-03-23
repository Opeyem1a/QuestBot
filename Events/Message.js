const {prefix, name} = require('../config.json');

module.exports = {
  handle(client, commands, campaigns, message) {
    //if the message doesn't have the unique prefix or is another bot, stop
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    //args is an array of everything the user typed, besides the prefix
  	const args = message.content.slice(prefix.length).split(/ +/);
    //command is the name of the command they called. This shifts args so args only contains the arguments
  	const command = args.shift().toLowerCase();
    //is that's not a loaded command, stop
    if (!commands.has(command)) return;

    //run this command
    try {
      commands.get(command).execute(client, campaigns, message, args);
    } catch (error) {
    	console.error(error);
    	message.reply(`The command ${command} could not be executed.`);
    }
  }
}
