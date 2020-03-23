//import modules and necessary directories
const campaigns = require(../Data/Campaigns/);
const fs = require('fs');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

function generateList(){

}

module.exports = {
  execute(client, message, args) {
      if(validate(args)){
        message.channel.send(sum(args));
      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  enabled: true,
  guildOnly: false,
  aliases: [],
  botPerms: [],
  name: "add",
  description: "Returns a list of all available Campaigns to join.",
  usage: "",
  usageDelim: ""
}
