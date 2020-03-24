//import required node_modules
const format = require('../Functions/discordFormat.js');
const timefunc = require('../Functions/timeFunc.js');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

module.exports = {
  execute(client, message, args) {
      if(validate(args)){
        var response = [];
        for(campaign of client.campaigns){
          avgTime = timefunc.averageCampTime(campaign);
          response.push(format.bold(campaign[0]), format.quote(campaign[1].synopsis), format.quote(avgTime));
          response.push(" ");
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
  usage: ""
};
