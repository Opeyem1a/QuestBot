//importing modules
const Discord = require('discord.js');
const fs = require('fs');

//setting base paramaters for config and command files
const campaignsDir = './Data/Campaigns/';
const config = require('./config.json');
const commandsDir = "./Commands/";

//import all event handlers
const messageEvent = require("./Events/Message.js");

//initialize the client and a Collection of commands
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.campaigns = new Discord.Collection();

//gather all the files that correspond to commands into an array
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

//Loads commands into the client
for (const file of commandFiles) {
	const command = require(`${commandsDir}${file}`);
	client.commands.set(command.name, command);
  console.log(command.name);
}

//gather all the campaign data files
const campaignFiles = fs.readdirSync(campaignsDir).filter(file => file.endsWith('.json'));

//Loads campaigns into the client
for (const file of campaignFiles) {
	const campaign = require(`${campaignsDir}${file}`);
	client.campaigns.set(campaign.name, campaign);
  console.log(campaign.name);
}

client.once('ready', () => {
	console.log('Ready!');
  //console log the bot's custom invite link
  console.log(`https://discordapp.com/oauth2/authorize?client_id=${config.id}&scope=bot`);
});

client.on('message', message => {
  //pass the message to the message event handler
  messageEvent.handle(client, client.commands, client.campaigns, message);
});

client.login(config.token);
