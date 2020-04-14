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
  embed.setTitle(f.capitalize(command.name));

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
          }  else {
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
  usage: "[command]"
};
