const Discord = require('discord.js');
const Cards = require('./CAHCards.json');
const Round = require('./Round.js');
const f = require('../../Functions/discordFormat.js');
const { whitecards, blackcards } = require('./CAHCards.json');

const embedColour = '#0099ff';
const emojiMap = new Map([
  [1, '1️⃣'],
  [2, '2️⃣'],
  [3, '3️⃣'],
  [4, '4️⃣'],
  [5, '5️⃣']]);

function sendPlayerMessage(user, players, resolve){
  console.log(`Sent message to [${user.username}]`);
  user.send(`Adding you to the game...`).then(messageDM => {
    console.log(user.username);
    //map contains a player's hand of cards
    const val = [players.get(user.id), messageDM, new Map()];
    players.set(user.id, val);
    resolve();
  })
  .catch(error => console.error(error));
}

async function updateMessage(playersOBJ, data, resolve){
  //data === [User Object, DM Message Object, Map() of current hand]
  var player = data[0];
  var dm = data[1];
  var handMap = data[2];

  const promise = new Promise((resolve) => {
    var embed = new Discord.MessageEmbed()
       .setColor(embedColour)
       .setTitle(`${data[0].username}'s Hand`)
       .setDescription(`Card in play: N/A`)
       .addFields(
            { name: '1️⃣', value: handMap.get(1) },
            { name: '2️⃣', value: handMap.get(2) },
            { name: '3️⃣', value: handMap.get(3) },
            { name: '4️⃣', value: handMap.get(4) },
            { name: '5️⃣', value: handMap.get(5) },);
    resolve(embed);
  })

  promise.then((embed) => {
    player.send(embed)
      .then(newDM => {
        console.log(newDM.embeds[0].description);
        var newData = [data[0], newDM, data[2]];
        playersOBJ.set(data[0].id, newData);
        return newDM;
      })
      .then(newDM => {
        dm.delete().catch(error => console.error(error));
        console.log("B" + newDM.embeds[0].description);
        emojiMap.forEach(values => {
          newDM.react(values);
        })
      })
      .then(() => resolve())
      .catch(error => console.error(error));
  })
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
          //draw 5 beginning cards and display each hand to its player
          for(var i = 1; i <= 5; i++){
            //values[2] is the map containing this player's hand
            values[2].set(i, this.whitecards.shift());
          }
        })
      })
      .then(() => {
        let updateAll = Array.from(this.players.values()).map(data => {
          return new Promise((resolve) => {
            //add reactions 1 - 5 corresponding to cards in their hand
            updateMessage(this.players, data, resolve);
          })
        })

        return Promise.all(updateAll).catch(e => console.error(e));
      })
      .then(() => {
        //determine a turn order array storing user ids of players
        const turnOrder = Array.from(this.players.keys()).map(key => {
          return key;
        });

        var turn = 0;
        var win = 0;
        //loop while game is not over
        do {
          console.log("Here2");
          //decide whos turn it currently is (go 1 by 1 through each player) and increment turn after
          //create a round with the round owner distinct from the players
          var currentRound = new Round(
            this.client,
            this.message,
            turnOrder[turn++ % turnOrder.length], //round owner id
            this.players,
            this.blackcards.shift() //chooses a blackcard for this turn
          );

          //create a Round object and run it
          const winner = currentRound.run();
          //choose a black card and show it to everyone (edit their DM message), black card on top
        } while (win != 0);
        // this.players.forEach(values => {
        //   console.log("H" + values[1].embeds[0].description);
        //   values[1].react('😢');
        // })
      })

      .catch(e => console.error(e));

      //// TODO: option for new hand? Potentially another reaction for resuffle hand?
        //hand() should probably be a function at this point

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
