//import required node_modules
const f = require('../Functions/discordFormat.js');
const list = require('./list.js');
const responses = require('../responses.json');
const config = require('../config.json');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

//returns a help string for a command given an array containing the information needed
function displayCommand(items){
  var output = "";
  //if this is for a bulk commands view print.
  if(items.length == 3){
    output = `${config.prefix}${items[0]}`;
    if(!items[2]) items[2] = "-----";
    output = `${f.bold(f.tickcode(output))} ${f.italics(items[2])} \n${items[1]}`;
  } else { //if a specific command was given
    output = `${config.prefix}${items[0]}`;
    if(!items[2]) items[2] = "-----";

    output = `${f.tickcode(output)}`;
    if(items[3] != 0) {
      var aliases = items[3].reduce((a, b) => { return a + "|" + b; },"");
      output = `${output}${f.italics(items[2])} \n${aliases} \n${items[1]}`;
    } else {
      output = `${output}${f.italics(items[2])} \n${items[1]}`;
    }
  }
  return output;
}

//returns a help string for a campaign given an array containing the information needed
function displayCampaign(items){
  var output = "";

  return output;
}


module.exports = {
  execute(client, message, args) {
    //if the arguments are valid
      if(validate(args)){
        //initialize the items array to stored relevant information about the cammond/campaign
        var items =[];
        var response = "";

        //if the help command was called without specifying a command or campaign
        if(args.length == 0) {
          for(var command of client.commands){
            items = [];
            command = command[1];
            items.push(command.name, command.description, command.usage);
            response = `${response}${displayCommand(items)}\n`;
          }
          message.channel.send(response);
          return;
        }

        // if a command/campaign was specified in the help call
        if(client.commands.has(args[0].toLowerCase())){
          command = client.commands.get(args[0]);
          items.push(command.name, command.description, command.usage, command.aliases);
          response = displayCommand(items);
        } else if(client.campaigns.has(args[0].toLowerCase())){
          campaign = client.campaigns.get(args[0])[1];
          items.push(campaign.name, campaign.synopsis, campaign.tasks);
          response = displayCampaign(items);
        } else {
          response = responses.unfoundItem;
        }

        message.channel.send(response);
      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  enabled: true,
  guildOnly: false,
  aliases: ["?"],
  botPerms: [],
  name: "help",
  description: "Guide for bot commands overall or individually.",
  usage: "[Command | Campaign]"
};
