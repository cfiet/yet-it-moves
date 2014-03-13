"use strict";

var utils = require("./utils");
var vector2 = require("./vector");

function planet (state) {
  state = state || {};

  var mass = state.mass || 1.0;
  var position = vector2(state.position);
  var speed = vector2(state.speed);

  return {
    position: function (v) {
      if(v) {
        position = v;
      }
      return position;
    },
    speed: function (v) {
      if(v) {
        speed = v;
      }
      return speed;
    },
    mass: function () {
      return mass;
    },
    update: function(position, speed) {
      position = position;
      speed = speed;
    }
  }
}

module.exports = {
  planet: planet
};
