"use strict";

var planet = require("./planet");

function simulation(initialPlanets, solverFactory, rendererFactory, params) {
  params = params || {};

  var running = params.running || false;
  var step = params.step || 0.5;
  var time = 0;
  var delay = params.delay || 40;

  var planets = initialPlanets.map(planet);
  var solver = solverFactory(planets);
  var renderer = rendererFactory(planets);

  var interval = null;

  function start() {
    interval = setInterval(function () {
      time += step;
      solver.step(step);
      renderer.frame(time);
    }, delay);
  }

  function stop() {
    clearInterval(interval);
    interval = null;
  }

  return {
    start: start,
    stop: stop,
    isRunning: function () {
      return interval !== null;
    }
  };
};

module.exports = simulation;
