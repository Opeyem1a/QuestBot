//import required node_modules
const f = require('../Functions/discordFormat.js');
const list = require('./list.js');
const responses = require('../responses.json');
const config = require('../config.json');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
}

//returns a help string for a command given an array containing the information needed
function displayCommand(items){
  var output = "";
  //if this is for a bulk commands view print.
  if(items.length == 3) {
    output = `${config.prefix}${items[0]}`;
    //if there is no usage parameter, place this in it's position instead
    if(!items[2]) items[2] = f.code("          ");
    output = `${f.bold(f.code(output))} ${f.italics(f.code(items[2]))} \n${f.italics(items[1])}`;
  } else { //if a specific command was given
    output = `${config.prefix}${items[0]}`;
    //if there is no usage parameter, place these lines in it's position instead
    if(!items[2]) items[2] = f.code("          ");
    //format the command with the correct prefix
    output = `${f.bold(f.code(output))}`;
    //if there are alias names for this command, concatenate them here and add to output
    if(items[3] != 0) {
      //format list of aliases: i.e. Alias1 | Alias2 | etc
      var aliases = items[3].reduce((a, b) => {
        b = f.code(b);
        if(a){ return a + "|" + b; } else {return b}
      },"");
      aliases = `${f.code('Aliases')} ${aliases}`;
      output = `${output} ${f.italics(f.code(items[2]))} \n${aliases} \n${f.italics(items[1])}`;
    } else {
      //if no aliases, skip this section of the output entirely
      output = `${output} ${f.italics(f.code(items[2]))} \n${items[1]}`;
    }
  }
  return output;
}

//returns a help string for a campaign given an array containing the information needed
function displayCampaign(items){
  var output = "";
  //format the string and capitalize the Name of the campaign properly
  output += `${f.bold(f.capitalize(items[0]))} - ${f.code(items[2].length + 'Tasks')} \n${items[1]}`;
  return output;
}

module.exports = {
  execute(client, message, args) {
    //if the arguments are valid
      if(validate(args)){
        try {
          //initialize the items array to stored relevant information about the cammond/campaign
          var items =[];
          var response = "";

          //if the help command was called without specifying a command or campaign
          if(args.length == 0) {
            //for every command loaded to the client
            for(var command of client.commands){
              items = [];
              var command = command[1];
              //push relevant information from the command
              items.push(command.name, command.description, command.usage);
              response = `${response}${displayCommand(items)}\n`;
            }
            //message the help box for this command
            message.channel.send(response);
            return;
          }

          // if a command was specified in the help call
          if(client.commands.has(args[0].toLowerCase())){
            //find this specific command in the client's commands
            command = client.commands.get(args[0]);
            //push relevant information from the command
            items.push(command.name, command.description, command.usage, command.aliases);
            response = displayCommand(items);
          // if a campaign was specified in the help call
          } else if(client.campaigns.has(args[0].toLowerCase())){
            //find this specific campaign in the client's campaign's
            campaign = client.campaigns.get(args[0]);
            //push relevant information from the campaign
            items.push(campaign.name, campaign.synopsis, campaign.tasks);
            response = displayCampaign(items);
          } else {
            //if the argument matches no commands or campaigns, return a default message
            response = responses.unfoundItem;
          }
          //message the help box for the required scenario in the chat
          message.channel.send(response);
        } catch (error) {
          console.error(error);
        }
      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  enabled: true,
  guildOnly: false,
  aliases: ["?", "idk"],
  botPerms: [],
  name: "help",
  description: "Guide for bot commands overall or individually.",
  usage: "[Command | Campaign]"
};
