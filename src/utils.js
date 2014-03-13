module.exports = {
  random: function(start, end) {
    if(end < start) {
      var tmp = start;
      start = end;
      end = tmp;
    }
    return start + Math.random() * (end - start);
  }
};
