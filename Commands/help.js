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

      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  enabled: true,
  guildOnly: false,
  aliases: [],
  botPerms: [],
  name: "help",
  description: "Guide for bot commands overall or individually.",
  usage: "[Command | Campaign | Task]"
};
