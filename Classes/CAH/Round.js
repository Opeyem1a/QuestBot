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

  resolve() {
    return this.winner;
  }

  run() {
    //display the in-play black card to all players
    var start = new Promise((resolve, reject) => {
      this.owner = this.players.get(this.ownerID)[0];
      resolve("Starting Round");
    })
    start.then(() => {
      this.players.forEach(player => {
        if(player[0].id == this.ownerID) {
          const newEmbed = new Discord.MessageEmbed(/*player[1].embeds[0]*/)
              .setTitle(`Your Turn!`)
              .setDescription(`Card in play: ${this.blackcard}`)
              .addField(`Your Hand`, )
              .setFooter(`${player[0].username}'s Hand`);
        } else {
          const newEmbed = new Discord.MessageEmbed(player[1].embeds[0])
              .setTitle(`${this.owner.username}'s Turn!`)
              .setDescription(`Card in play: ${this.blackcard}`)
              .setFooter(`${player[0].username}'s Hand`);
        }
      });
      player[1].edit(newEmbed).catch(e => console.error(e))
    }).then(() => {
      const filter = m => {return m.content.toLowerCase().startsWith('reveal') && m.author.id === this.ownerID;};
      this.owner.dmChannel.awaitMessages(filter, { max: 1, time: 200000, errors: ['time'] })
          .then(() => {
            this.ownerChoose();
          })
          .catch(() => {
            this.ownerTimeout();
          });
    })

    .catch(error => console.error(error));
  }

  ownerTimeout(){
    //owner didn't choose to reveal in time, tell them this
    this.ownerChoose();
  }

  ownerChoose(){
    console.log(`${this.owner.username} Revealed!`);
  }

  playCard(cardNum, player, blackcard) {
    //remove a card after it is played from a user's hand
    this.players.get(player)[2].delete(cardNum);
  }


}
