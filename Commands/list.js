//import modules and necessary directories

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

module.exports = {
  execute(client, campaigns, message, args) {
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
  name: "list",
  description: "Returns a list of all available Campaigns to join.",
  usage: "",
  usageDelim: ""
}
