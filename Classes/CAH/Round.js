const Discord = require('discord.js');

const f = require('../../Functions/discordFormat.js');
const { whitecards, blackcards } = require('./CAHCards.json');

module.exports = class Round {
  constructor(client, message, ownerID, players, blackcard) {
    //called like (this.client, this.message, ownerID, this.players, blackcard) in Game
    this.client = client;
    this.message = message;
    this.ownerID = ownerID;
    this.players = players;
    this.blackcard = blackcard;
    this.owner = null;

    this.playedcards = new Map();
  }

  winner() {
    return 1;
  }

  run() {
    return new Promise((resolveOut, rejectOut) => {
      //display the in-play black card to all players
      var start = new Promise((resolve, reject) => {
        this.owner = this.players.get(this.ownerID)[0];
        console.log(`Starting Round`);
        resolve("Starting Round");
      })
      start.then(() => {
        this.players.forEach(player => {
          var newEmbed;
          if(player[0].id == this.ownerID) { //if this player is the turn owner
            var ownerHand = Array.from(this.players.get(this.ownerID)[2].values()).reduce((acc, next) => {
              if(acc) return `${acc}, ${next}`; else return `${next}`;
            }, "");
            newEmbed = new Discord.MessageEmbed()
                .setTitle(`Your Turn!`)
                .setDescription(`Card in play: ${this.blackcard}`)
                .addField(`What do you do?`, `Once you've confirmed that everyone has locked in their choices, send 'reveal' in this channel!`, false)
                .addField(`Your Hand`, ownerHand, false)
                .setFooter(`${player[0].username}'s Hand`);
          } else {
            newEmbed = new Discord.MessageEmbed(player[1].embeds[0])
                .setTitle(`${this.owner.username}'s Turn!`)
                .setDescription(`Card in play: ${this.blackcard}`)
                .setFooter(`${player[0].username}'s Hand`);
          }
          player[1].edit(newEmbed).catch(e => console.error(e));
        });
      }).then(() => {
        return new Promise((r, rj) => {
          const filter = m => {return m.content.toLowerCase().startsWith('reveal') && m.author.id === this.ownerID;};
          this.owner.dmChannel.awaitMessages(filter, { max: 1, time: 200000, errors: ['time'] })
              .then(() => {
                this.ownerChoose(r);
              })
              .catch(() => {
                this.ownerTimeout();
              });
        });
      })
      .then(() => {
        resolveOut("Bruh");
      })
      .catch(error => console.error(error));
    });
  }

  ownerTimeout(resolve){
    //owner didn't choose to reveal in time, tell them this
    this.ownerChoose(resolve);
    return;
  }

  ownerChoose(resolve){
    console.log(`${this.owner.username} Revealed!`);
    resolve();
    return;
  }

  playCard(cardNum, player, blackcard) {
    //remove a card after it is played from a user's hand
    this.players.get(player)[2].delete(cardNum);
  }


}
