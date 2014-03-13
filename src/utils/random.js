"use strict";

var seed = 6;

module.exports = {
  getSeed: function () {
    return seed;
  },
  setSeed: function (v) {
    seed = v;
  },
  random: function (min, max) {
    min = min || 0;
    max = max || 1;

    var tmp, r;

    if(min > max) {
      tmp = min;
      min = max;
      max = tmp;
    }

    seed = (seed * 9301 + 49297) % 233280;
    r = seed / 233280;

    return min + rnd * (max-min);
  }
}
