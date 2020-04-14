//import required node_modules
const format = require('../Functions/discordFormat.js');
const timefunc = require('../Functions/timeFunc.js');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

module.exports = {
  execute(client, message, args) {
    //if arguments are valid
      if(validate(args)){
        var response = [];
        //loop through each campaign
        for(campaign of client.campaigns){
          //Compute the average time to complete each task in the campaign
          avgTime = timefunc.averageCampTime(campaign);
          //Place info within an array that will be printed as a list
          response.push(format.bold(campaign[0]), format.quote(campaign[1].synopsis), format.quote(avgTime));
          response.push(" ");
        }
        message.channel.send(format.listItems(response));
      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  enabled: false,
  guildOnly: false,
  aliases: [],
  userPermLevel: 3,
  botPerms: [],
  name: "list",
  description: "Returns a list of all available Campaigns to join.",
  usage: ""
};
