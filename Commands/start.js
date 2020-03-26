//import required node_modules
const f = require('../Functions/discordFormat.js');
const fs = require('fs');
const responses = require('../responses.json');

const userDir = './Data/UserData/';

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

//initializes new user files with basic information
function initFile(message, filename){
  //create a default json object
  const base = `.${userDir}default.json`;
  var updated = require(base);
  //modify this object to have the user's basic information
  updated.id = message.author.id;
  updated.username = message.author.username;

  //write this object back to the user's file
  fs.writeFile(filename, JSON.stringify(updated, null, 2), (error) => {
    if (error) return console.error(error);
    console.log(`${message.author.username}: Successful file creation.`);
  });
}

module.exports = {
  execute(client, message, args) {
    //if arguments are valid
      if(validate(args)){
        try {
          //collect all currently saved user files
          const userFiles = fs.readdirSync(userDir);
          //loop through each of them
          for(const file of userFiles){
            //if a file for this user is found in existing files
            if(file === `${message.author.id}.json`){
              message.channel.send(`${responses.userFileExists} ${f.bold(message.author.username)}!`);
              return;
            }
          }

          //else, a new user file must be created for this user
          initFile(message, `${userDir}${message.author.id}.json`);
          message.channel.send(`${responses.userNewFile} ${f.bold(message.author.username)}!`);

        } catch(error){
          console.error(error);
        }
      } else {
        message.reply("Sorry, that wasn't valid");
      }
  },
  enabled: true,
  guildOnly: false,
  aliases: ["begin"],
  botPerms: [],
  name: "start",
  description: "Creates a user account for quests.",
  usage: ""
};
