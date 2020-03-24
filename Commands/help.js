//import required node_modules
const format = require('../Functions/discordFormat.js');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

function calAverage(array){
  var sum = array.reduce((a,b) => {
    return a + b;
  }, 0);
  return sum / array.length;
}

module.exports = {
  execute(client, campaigns, message, args) {
      if(validate(args)){
        var response = [];
        for(campaign of campaigns){
          avgTime = averageTime(campaign);
          response.push(format.bold(campaign[0]), format.quote(campaign[1].synopsis), format.quote(avgTime));
          response.push(" ");
        }
        message.channel.send(format.listItems(response));
      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  averageTime(campaign){
    var times = [];
    for(const task of campaign[1].tasks){
      if(task.timeframe.length > 0)
        times.push(calAverage(task.timeframe));
      else
        times.push(0);
    }
    return calAverage(times);
  },
  enabled: true,
  guildOnly: false,
  aliases: [],
  botPerms: [],
  name: "list",
  description: "Returns a list of all available Campaigns to join.",
  usage: "",
  usageDelim: ""
};
