"use strict";

var planet = require("./planet");

function simulation(initialPlanets, solver, renderer, params) {
  params = params || {};

  var running = params.running || false;
  var step = params.step || 0.1;
  var time = 0;
  var delay = params.delay || 40;

  var planets = initialPlanets.map(planet);

  var interval;

  function start() {
    running = true;
    interval = setInterval(function () {
      time += step;
      solver.step(step);
      renderer.frame(time);
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
