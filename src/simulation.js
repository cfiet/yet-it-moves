"use strict";

var planet = require("./planet"),
    predictorFactory = require("./predictor");

function simulation(initialPlanets, params) {
  params = params || {};

  var running = params.running || false;
  var step = params.step || 0.1;
  var delay = params.delay || 40;

  var planets = initialPlanets.map(planet);
  var predictor = predictorFactory(planets);

  var interval;

  function start() {
    running = true;
    interval = setInterval(function () {
      predictor.step(step);
    }, delay);
  }

  function stop() {
    resetInterval(interval);
    running = false;
  }

  return {
    start: start,
    stop: stop,
    isRunning: function () {
      return running;
    }
  };
};

module.exports = {
  simulation: simulation
};
