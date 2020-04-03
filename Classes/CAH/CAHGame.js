const Cards = require('./CAHCards.json');
const f = require('../../Functions/discordFormat.js');
const { whitecards, blackcards } = require('./CAHCards.json');

module.exports = class CAHGame {
  static playing = new Map();
  constructor(client, message, args) {
    //args => [maxScore]
    this.maxScore = args[0];
    this.client = client;
    this.message = message;
    this.players = new Map();
    this.playersDM = [];
    this.playedCards = [];
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
          this.play();
        })
    }
  }

  async play() {
    this.players.forEach(user => {
      console.log("Sent message to a user");
      user.send(`Hiya`).then(messageDM => {
        console.log(user.username);
        this.players.set(user.id, [this.players.get(user.id), messageDM]);
      })
    })
  }

  test(playersMessage) {
    this.players = playersMessage;
    console.log(`BRUH`);
    // console.log(playersMessage);
    for(const obj of playersMessage){
      console.log(obj);
      obj[1].react('😜');
    }
  }
};

//this.message.channel.messages.cache.get(this.joinMessage); ======> retreives a message object by snowflake
