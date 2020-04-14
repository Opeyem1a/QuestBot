//import required node_modules
const Discord = require(`discord.js`);
const f = require('../Functions/discordFormat.js');
const list = require('./list.js');
const responses = require('../responses.json');
const config = require('../config.json');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
}

function addEmbedField(embed, command){
  var usage = command.usage ? f.italics(command.usage) : "";
  var title = `${config.prefix}${command.name} ${usage}`;
  var value = command.description
  embed.addField(title, value, false);
}

function commandEmbed(embed, command){
  embed.setTitle(command.name);

  var params = command.usage ? f.italics(command.usage) : "";
  var usage = `${config.prefix}${command.name} ${params}`;
  embed.addField(`Usage`, usage, false);

  var aliases = command.aliases.reduce((a, b) => {
        b = f.code(`'${b}'`);
        if(a){ return `${a} ${b}`; } else {return b}
      },"");

  var checkAlias = aliases.length == 0 ? false: embed.addField(`Aliases`, aliases, false);

  embed.addField(`Description`, command.description, false);
  return embed;
}

function campaignEmbed(campaign){

}

//returns a help string for a command given an array containing the information needed
function displayCommand(items){
  var output = "";
  //if this is for a bulk commands view print.
  if(items.length == 3) {
    output = `${config.prefix}${items[0]}`;
    //if there is no usage parameter, place this in it's position instead
    var usage = items[2] ? f.code(items[2]) : "";
    output = `${f.bold(output)} ${usage} \n${f.italics(items[1])}`;
  } else { //if a specific command was given
    output = `${config.prefix}${items[0]}`;
    //format the command with the correct prefix
    output = `${f.bold(f.code(output))}`;
    //if there is no usage parameter, place these lines in it's position instead
    var usage = items[2] ? f.code(items[2]) : "";
    //if there are alias names for this command, concatenate them here and add to output
    if(items[3] != 0) {
      //format list of aliases: i.e. Alias1 | Alias2 | etc
      var aliases = items[3].reduce((a, b) => {
        b = f.code(`'${b}'`);
        if(a){ return `${a} ${b}`; } else {return b}
      },"");
      aliases = `Aliases: ${aliases}`;
      output = `${output} ${usage} \n${aliases} \n${f.italics(items[1])}`;
    } else {
      //if no aliases, skip this section of the output entirely
      output = `${output} ${usage} \n${items[1]}`;
    }
  }
  return output;
}

//returns a help string for a campaign given an array containing the information needed
function displayCampaign(items){
  var output = "";
  //format the string and capitalize the Name of the campaign properly
  var numTasks = items[2].length == 1 ? items[2].length + ' Task' : items[2].length + ' Tasks';
  output += `${f.bold(f.capitalize(items[0]))} - ${f.code(numTasks)} \n${items[1]}`;
  return output;
}

module.exports = {
  execute(client, message, args) {
    //if the arguments are valid
      if(validate(args)){
        try {
          var embed = new Discord.MessageEmbed()
                  .setColor(`#FF0000`)
                  .setTitle(`${config.name} Commands List`)
                  .setFooter(`${config.name}`);

          //if the help command was called without specifying a command or campaign
          if(args.length == 0) {
            //for every command loaded to the client
            client.commands.forEach(value => {
              addEmbedField(embed, value);
            })
            //message the help embed for this command
            message.channel.send(embed);
            return;
          }

          // if a command was specified in the help call
          if(client.commands.has(args[0].toLowerCase())){
            //find this specific command in the client's commands
            command = client.commands.get(args[0]);
            response = commandEmbed(embed, command);
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
        message.reply(responses.invalidCall);
      }
  },
  enabled: true,
  guildOnly: false,
  aliases: ["?", "idk"],
  userPermLevel: 3,
  botPerms: [],
  name: "help",
  description: "Guide for bot commands overall or individually.",
  usage: "[Command | Campaign]"
};
