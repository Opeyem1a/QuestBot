//import required node_modules
const f = require('../Functions/discordFormat.js');
const fs = require('fs');
const responses = require('../responses.json');

const userDir = './Data/UserData/';
const userFiles = fs.readdirSync(userDir);

//validate functions approves/denies the arg values that are passed
function validate(args){
  return true;
};

function initFile(message, file){
  file.id = message.author.id;
  file.username = message.author.username;
}

module.exports = {
  execute(client, message, args) {
    //if arguments are valid
      if(validate(args)){
        try {
          for(const file of userFiles){
            //if a file for this user is found in existing files
            if(file === `${message.author.id}.json`){
              message.channel.send(`${responses.userFileExists} ${message.author.username}!`);
              return;
            }
          }

          //else, a new user file must be created for this user
          fs.copyFile(`${userDir}default.json`, `${userDir}${message.author.id}.json`, (error) => {
            //new file is created by copying the .json structure of a default file
            if(error) throw error;
            console.log(`${message.author.username}: Successful file creation.`);
          })

          const file = require(`${userDir}${message.author.id}.json`);
          initFile(file);

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
