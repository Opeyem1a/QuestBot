//import required node_modules
const format = require('../Functions/discordFormat.js');
const list = require('./list.js');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

module.exports = {
  execute(client, message, args) {
      if(validate(args)){
        var items =[];
        var response = "";
        try{
          const command = client.commands.get(args[0]);
          items.push(command.name, command.aliases, command.description, command.usage);
        } catch (error){
          try {
            const campaign = client.campaigns.get(args[0]);
            items.push(campaign.name, campaign.aliases, campaign.description, campaign.usage);
          } catch (error1) {
            console.error(error);
            console.error(error1);
          }
        }

        message.channel.send(listItems(items));
      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  display(items){

  },
  enabled: true,
  guildOnly: false,
  aliases: [],
  botPerms: [],
  name: "help",
  description: "Guide for bot commands overall or individually.",
  usage: "[Command | Campaign]"
};
