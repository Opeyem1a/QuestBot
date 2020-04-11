const Discord = require('discord.js');
const Cards = require('./CAHCards.json');
const f = require('../../Functions/discordFormat.js');
const { whitecards, blackcards } = require('./CAHCards.json');

const embedColour = '#0099ff';

function sendPlayerMessage(user, players, resolve){
  console.log("Sent message to a user");
  user.send(`Hiya`).then(messageDM => {
    console.log(user.username);
    //map contains a player's hand of cards
    const val = [players.get(user.id), messageDM, new Map()];
    players.set(user.id, val);
    resolve();
  })
  .catch(error => console.error(error));
}

function updateMessage(data){
  //data === [User Object, DM Message Object, Map() of current hand]
  var player = data[0];
  var dm = data[1];
  var handMap = data[2];
  //if a blackcard was given, use it as a description
  //var blackCards = !!data[3] ?
  const embed = new Discord.MessageEmbed()
	   .setColor(embedColour)
     .setTitle(`${player.username}'s Hand`)
     .setDescription(`Card in play: N/A`)
  var text =
  dm.edit()
}

function shuffle(cards) {
  var shuffled = [];
  return new Promise((resolve, reject) => {
    shuffled = [].slice.call(cards).sort(() => Math.random() - 0.5);
    resolve(shuffled);
  });
}

module.exports = class CAHGame {
  static playing = new Map();
  constructor(client, message, args) {
    //args => [maxScore]
    this.client = client;
    this.blackcards = blackcards;
    this.whitecards = whitecards;
    this.message = message;
    this.players = new Map();
    this.GM = message.author;
    this.joinMessage = "";
  }

  leaderboard(){

  }

  recruit() {
    if(CAHGame.playing.has(this.GM.id)) {
      this.message.channel.send(`${f.bold(this.message.author.username)}, you're already playing a game of Cards Against Humanity.\nPlease leave your previous game before starting a new one!`);
    } else {
      CAHGame.playing.set(this.GM.id, this.GM);
      this.message.channel.send("Join the game.")
        .then(message => {
          message.react('✔');
          return message;
        })
        .then(message => {
          this.joinMessage = message;
          return message;
        })
        .then(message => {
          const filter = m => { return m.content.toLowerCase().startsWith('start') && m.author.id === this.GM.id; }
          const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });
          collector.on('end', collected => {
            if(collected.size == 0){
              message.channel.send(`The Cards Against Humanity game started by ${this.message.author.username} has timed out. :'(`);
              CAHGame.playing.delete(this.GM.id);
              return;
            } else this.start(collected);
          });
        })
        .catch((error) => console.error(error));
      }
    }

  start(collected) {
    var message = collected.first();
    var userReactions = this.joinMessage.reactions.cache.filter(reaction => reaction.emoji.toString() === '✔');
    for(const reaction of userReactions.values()){
      reaction.users.fetch()
        .then(map => {
          for(const user of map.values()){
            if(!CAHGame.playing.has(user.id)) {
              if(user.bot) continue;
              else {
                console.log(`${user.username} has joined a game of CAH.`);
                this.players.set(user.id, user);
                CAHGame.playing.set(user.id, user);
              }
            } else {
              this.message.channel.send(`${f.bold(user.username)}, you're already playing another Cards Against Humanity game so you can't be added to this one! :'(`);
            }
          }
        }).then(() => {
          this.setup();
        })
    }
  }

  setup() {
    let sendAll = Array.from(this.players.values()).map(user => {
      return new Promise((resolve) => {
        sendPlayerMessage(user, this.players, resolve);
      });
    });
    Promise.all(sendAll).then(() => this.test())
      .then(() => this.play())
      .catch(error => console.error(error));
  }

  play() {
    //shuffle cards and players
    var cards = [this.whitecards, this.blackcards, this.players];
    let shuffled = cards.map(group => {
      return shuffle(group);
    })

    Promise.all(shuffled)
      .then(shuffled => {
        this.whitecards = shuffled[0];
        this.blackcards = shuffled[1];
      })
      .then(() => {
        this.players.forEach(values => {
          for(var i = 1; i <= 5; i++){
            //values[2] is the map containing this player's hand
            value[2].set(i, this.whitecards.shift())
          }
        })
      })
    //draw 5 beginning cards and display each hand to its player
    //add reactions 1 - 5 corresponding to cards in their hand

      //option for new hand? Potentially another reaction for resuffle hand?
        //hand() should probably be a function at this point

    //loop while game is not over
      //decide whos turn it currently is (go 1 by 1 through each player)
      //create a round with the round owner distinct from the players
      //choose a black card and show it to everyone (edit their DM message), black card on top

      //create a Round object and run it
              //called like (this.client, this.message, this.players, blackcard) in Game

      //Round object will have a function that returns the winner of this return (and cards involved, and person whose turn it was)
        //store the winning white and black pair to that players leaderboard entirely
        //increment winning player's leader board entry by 1
        //check if game still needs completing

      //Draw new card for everyone to replace played card
      //Display each players new hand
      //Delete all reactions on player DM messages
      //add reactions 1 - 5 corresponding to cards in their hand again

      //continuous check for if the GM ends the game at any point, immediately move to end phase
  }

  test() {
    //players is now a map with values() of [user object, message DM object]
    this.players.forEach(values => {
      console.log(values[0].id);
      values[1].react('😆');
    })
  }
};

//this.message.channel.messages.cache.get(this.joinMessage); ======> retreives a message object by snowflake
