"use strict";

var prediction = require("./prediction");

function predictor(planets) {
  return {
    step: function (delta) {
      var predictions = planets.map(function (p) {
        return prediction(delta, p, planets);
      });

      predictions.map(function (p) {
        p.apply();
      });
    }
  };
}

module.exports = {
  predictor: predictor
}
