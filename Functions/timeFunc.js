module.exports = {
  calAverage(array){
    var sum = array.reduce((a,b) => {
      return a + b;
    }, 0);
    return sum / array.length;
  },
  averageTime(campaign){
    var times = [];
    for(const task of campaign[1].tasks){
      if(task.timeframe.length > 0)
        times.push(calAverage(task.timeframe));
      else
        times.push(0);
    }
    return calAverage(times);
  },
}
