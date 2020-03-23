//import required node_modules
const format = require('../Functions/discordFormat.js');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

module.exports = {
  execute(client, campaigns, message, args) {
      if(validate(args)){
        var response = [];
        for(campaign of campaigns){
          response.push(campaign[0]);
        }
        message.channel.send(format.listItems(response));
      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  enabled: true,
  guildOnly: false,
  aliases: [],
  botPerms: [],
  name: "list",
  description: "Returns a list of all available Campaigns to join.",
  usage: "",
  usageDelim: ""
}
