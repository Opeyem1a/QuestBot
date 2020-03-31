//import required node_modules
const fs = require('fs');
const f = require('../Functions/discordFormat.js');
const CAHGame = require('../Classes/CAHClass.js');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

function verifyBlack(args) {
  //args have had the command statement removed by this point, stil in array form
  if(args.includes("///")) return true;
}

function cardExists(cards, type, args){
  var exists = false;
  if(type === 'w') {
    for(var w in cards.whitecards){
      console.log('Check');
      exists = exists || (w.equalsIgnoreCase(args.join(" ")));
    }
  } else if(type === 'b') {
    for(var b in cards.blackcards){
      exists = exists || (b.equalsIgnoreCase(args.join(" ")));
    }
  }
  return exists;
}
module.exports = {
  execute(client, message, args) {
    //if arguments are valid
      if(validate(args)){
        if(args.length == 0) {
          const CAH = new CAHGame(client, message, args);
          CAH.recruit();
        } else {
          var type = args.shift().toLowerCase();
          if(!(type === 'w') && !(type === 'b')) {
            message.channel.send(`${f.bold(message.author.username)}, you can only add either 'w' or 'b' cards!`);
            return;
          }
          const cards = require('../Classes/CAHCards.json');
          if(cardExists(cards, type, args)){

          } else {
            fs.writeFile('./Classes/CAHCards.json', JSON.stringify(cards, null, 2), (error) => {
              if (error) console.error(error);
            });
          }
          return;
        }
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
  usage: "[w|b|leave|end] [new card details]"
};
