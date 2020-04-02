const f = require('../../Functions/discordFormat.js');
const { whitecards, blackcards } = require('./CAHCards.json');

module.exports = class Round {
  constructor(client, message, args) {
    //args = [array of players]
    var players = args[0];
    this.client = client;
    this.message = message;
  }


}
