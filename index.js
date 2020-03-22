//importing modules
const Discord = require('discord.js');
const fs = require('fs');

//setting base paramaters for config and command files
const config = require('./config.json');
const commandsDir = "./Commands";

//acquire all event handlers
const messageEvent = require("./Events/Message.js");

//initialize the client and a Collection of commands
const client = new Discord.Client();
client.commands = new Discord.Collection();

//gather all the files that correspond to commands into an array
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

//Loads commands into the client
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
  console.log(command.name);
}

client.once('ready', () => {
	console.log('Ready!');
  //console log the bot's custom invite link
  console.log(`https://discordapp.com/oauth2/authorize?client_id=${config.id}&scope=bot`);
});

client.on('message', message => {
  //pass the message to the message event handler
  messageEvent.handle(client, client.commands, message);
});

client.login(config.token);
