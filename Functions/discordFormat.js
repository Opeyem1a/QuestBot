module.exports = {
  bold(string){
    return `**${string}**`;
  },
  italics(string){
    return `*${string}*`;
  },
  underline(string){
    return `__${string}__`;
  },
  quote(string){
    return `> ${string}`;
  },
  code(string){
    return "`" + string + "`";
  },
  block(string, language){
      return "```" + language + "\n" + string + "```";
  },
  listItems(stringArr){
    return stringArr.reduce(function(a, b) {
      return a + '\n' + b;
    }, '');
  },
  capitalize(string){
    return string[0].toUpperCase() + string.substr(1).toLowerCase();
  }
}
