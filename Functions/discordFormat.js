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
    return `>${string}`;
  },
  tickcode(string){
    return "`" + string + "`";
  },
  codebox(string, language){
      return "```" + language + "\n" + string + "```";
  },
  listItems(stringArr){
    return stringArr.reduce(function(a, b) {
      return a + ''\n' + b;
    }, '');
  }
}
