//import required node_modules
const fs = require('fs');
const f = require('../Functions/discordFormat.js');
const CAHGame = require('../Classes/CAH/CAHGame.js');
const deleteTime = 10000;

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

module.exports = {
  execute(client, message, args) {
    //if arguments are valid
      if(validate(args)){
        const CAH = new CAHGame(client, message, args);
        CAH.recruit();

        //// TODO: Implement checkers for if they are playing a game and want to leave or end it.
        // if(args[0]) {
        //   switch(args.shift().toLowerCase()){
        //     case "leave":
        //     case "end":
        //       CAH = null;
        //       console.log('Game ended.');
        //       break;
        //   }
        // }
      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  enabled: true,
  guildOnly: false,
  aliases: ['playcah', 'cahplay'],
  userPermLevel: 3,
  botPerms: [],
  name: "cah",
  description: "Starts a Cards against Humanity game in this channel.",
  usage: "[leave|end]"
};
