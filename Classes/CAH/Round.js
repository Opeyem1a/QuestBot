const Discord = require('discord.js');

const f = require('../../Functions/discordFormat.js');
const { whitecards, blackcards } = require('./CAHCards.json');

module.exports = class Round {
  constructor(client, message, ownerID, players, blackcard) {
    //called like (this.client, this.message, ownerID, this.players, blackcard) in Game
    this.client = client;
    this.message = message;
    this.ownerID = ownerID;
    this.players = players
    this.blackcard = blackcard;

    this.playedcards = new Map();
  }

  resolve() {
    return this.winner;
  }

  run() {
    //display the in-play black card to all players
    this.players.forEach(values => {
      const newEmbed = new Discord.MessageEmbed(values[1].embeds[0])
         .setDescription(`Card in play: ${this.blackcard}`);

      values[1].edit(newEmbed).catch(e => console.error(e))
    });

  }

  playCard(cardNum, player, blackcard) {
    //remove a card after it is played from a user's hand
    this.players.get(player)[2].delete(cardNum);
  }


}
