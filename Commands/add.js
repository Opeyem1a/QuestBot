//validate functions approves/denies the arg values that are passed
function validate(args){
  if(typeof sum(args) != 'number' || isNaN(sum(args))){
    return false;
  } else {
    return true;
  }
};

function sum(args) {
  //computing the sum of an array
  var sum = args.reduce(function(a, b){
    return parseFloat(a) + parseFloat(b);
    }, 0);
  return sum;
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
  userPermLevel: 3,
  botPerms: [],
  name: "add",
  description: "Adds two numbers.",
  usage: ""
}
