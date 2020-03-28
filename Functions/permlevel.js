const levels = [
  {
    "name": "manager",
    "perms": ['MANAGE_MESSAGES', ]
  },
  {
    "name": "mod",
    "perms": ['MANAGE_MESSAGES', ]
  },
  {
    "name": "trusted",
    "perms": ['MANAGE_MESSAGES', ]
  },
  {
    "name": "base",
    "perms": ['MANAGE_MESSAGES', ]
  }
]

module.exports = {
  hasPermLevel(guildMember, lvl) {
    if(guildMember.hasPermission(levels[lvl].perms)) {
      console.log(`${guildmember.username} has permissions at level ${levels[lvl].name}`);
      return true;
    } else return false;
  }
}
