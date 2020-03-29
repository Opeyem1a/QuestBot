const levels = [
  {
    "name": "manager",
    "perms": ['MANAGE_SERVER', ]
  },
  {
    "name": "mod",
    "perms": ['MANAGE_MESSAGES', ]
  },
  {
    "name": "trusted",
    "perms": []
  },
  {
    "name": "base",
    "perms": []
  }
]

module.exports = {
  hasPermLevel(guildMember, lvl) {
    if(guildMember.hasPermission(levels[lvl].perms)) {
      console.log(`${guildMember.user.username} has permissions at level ${levels[lvl].name}`);
      return true;
    } else return false;
  }
}
