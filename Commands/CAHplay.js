//import required node_modules
const fs = require('fs');
const f = require('../Functions/discordFormat.js');
const CAHGame = require('../Classes/CAHClass.js');

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

function verifyBlack(message, args) {
  //args have had the command statement removed by this point, stil in array form

  //counts the occurrences of
  var count = args.reduce((p, item) => {
      return (item === '///') ? p + 1 : p;
    }, 0);
  if(count == 0) {
    message.channel.send(`${f.bold(message.author.username)}, you didn't include the "///" character to tell me where the blanks are!`);
  } else if(count > 1) {
    message.channel.send(`${f.bold(message.author.username)}....yeah let's hold off with the multi-blank cards for now, coming ${f.bold('soon')}™ though!`);
  } else {
    return true;
  }
  //return false if there isn't exactly 1 blank
  return false;
}

function cardExists(cards, type, args){
  var exists = false;
  if(type === 'w') {
    for(var w of cards.whitecards){
      //compare ignoring case and accents
      exists = exists || (w.localeCompare(args.join(" "), undefined, { sensitivity: 'base' }) === 0);
    }
  } else if(type === 'b') {
    for(var b in cards.blackcards){
      //compare ignoring case and accents
      exists = exists || (b.localeCompare(args.join(" "), undefined, { sensitivity: 'base' }) === 0);
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
            message.channel.send(`${f.bold(message.author.username)}, it looks like this card has already been added, sorry! :'(`);
          } else {
            if(type === 'w') cards.whitecards.push(args.join(" "));
            else {
              //for black cards, we check that '///' is included as a blank section
              if(verifyBlack(message, args)) cards.blackcards.push(args.join(" "));
              else return;
            }
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
