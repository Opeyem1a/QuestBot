//import required node_modules
const fs = require('fs');
const format = require('../Functions/discordFormat.js');
const CAHGame = require('../Classes/CAHClass.js');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

module.exports = {
  execute(client, message, args) {
    //if arguments are valid
      if(validate(args)){
        if(args.length == 0) {
          const CAH = new CAHGame(client, message, args);
          CAH.recruit();
        } else {
          const cards = require('../Classes/CAHCards.json');
          switch(args.shift().toLowerCase()) {
            case "w":
              cards.whitecards.push(args.join(" "));
              break;
            case "b":
              cards.blackcards.push(args.join(" "));
              break;
          }
          fs.writeFile('./Classes/CAHCards.json', JSON.stringify(cards, null, 2), (error) => {
            if (error) console.error(error);
          });
          return;
        }

        if(args[0]) {
          switch(args.shift().toLowerCase()){
            case "leave":
            case "end":
              CAH = null;
              console.log('Game ended.');
              break;
          }
        }
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
  usage: "[w|b|leave|end]"
};
