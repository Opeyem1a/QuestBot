//import node_modules
const { ball } = require('../responses.json');


//validate functions approves/denies the arg values that are passed
function validate(args){
  return args.length != 0;
};

module.exports = {
  execute(client, message, args) {
      if(validate(args)){
        message.reply(ball[Math.floor(Math.random() * ball.length)]);
      } else {
        message.reply("You have to ask a question first!");
      }
  },
  enabled: true,
  guildOnly: false,
  aliases: ['8', 'ball'],
  userPermLevel: 3,
  botPerms: [],
  name: "8ball",
  description: "Answers any yes/no question you have!",
  usage: "<question>"
}
