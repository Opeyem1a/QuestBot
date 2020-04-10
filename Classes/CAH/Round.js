const f = require('../../Functions/discordFormat.js');
const { whitecards, blackcards } = require('./CAHCards.json');

module.exports = class Round {
  constructor(client, message, players, blackcard) {
    //called like (this.client, this.message, this.players, blackcard) in Game
    var players = args[0];
    this.client = client;
    this.message = message;
    this.players = players
    this.playedcards = new Map();
    this.roundOwner =
  }


}
