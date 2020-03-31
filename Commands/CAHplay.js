//import required node_modules
const fs = require('fs');
const f = require('../Functions/discordFormat.js');
const CAHGame = require('../Classes/CAHClass.js');
const deleteTime = 10000;

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

function verifyBlack(message, args) {
  //args have had the command statement removed by this point, stil in array form
  var count = args.reduce((p, item) => {
    //counts the occurrences of "///"
    return (item === '///') ? p + 1 : p;
  }, 0);

  if(count == 0) {
    message.channel.send(`${f.bold(message.author.username)}, you didn't include the "///" to tell me where the blanks are!`);
  } else if(count > 1) {
    message.channel.send(`${f.bold(message.author.username)}....yeah let's hold off with the multi-blank cards for now, coming ${f.bold('soon™')} though!`);
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
        //if there are no extra arguments passed to command
        if(args.length == 0) {
          const CAH = new CAHGame(client, message, args);
          CAH.recruit();
        } else {
        //if arguments are passed to this command
          var type = args.shift().toLowerCase(); //determine the type of card being added
          if(!(type === 'w') && !(type === 'b')) {
            //if neither valid card type is entered, stop
            message.channel.send(`${f.bold(message.author.username)}, you can only add either 'w' or 'b' cards!`);
            return;
          }
          //retreive json object of the card set
          const cards = require('../Classes/CAHCards.json');
          //check if this new card entry already exists
          if(cardExists(cards, type, args)){
            message.channel.send(`${f.bold(message.author.username)}, it looks like this card has already been added, sorry! :'(`);
          } else {
            //add the card to the cards object
            if(type === 'w') cards.whitecards.push(args.join(" "));
            else {
              //for black cards, we check that '///' is included as a blank section
              if(verifyBlack(message, args)) cards.blackcards.push(args.join(" "));
              else return;
            }

            //write the cards object back to the original file
            fs.writeFile('./Classes/CAHCards.json', JSON.stringify(cards, null, 2), (error) => {
              if (error) console.error(error);
              //inform the user of a successful card entry
              message.reply(`successfully added a new card!`)
                .then(message => {
                  message.delete({ timeout: deleteTime });
                });
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
