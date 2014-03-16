"use strict";

var planet = require("./planet");

function simulation(initialPlanets, solverFactory, rendererFactory, params) {
  params = params || {};

  var running = params.running || false;
  var step = params.step || 0.25;
  var time = 0;
  var delay = params.delay || 0;

  var planets = initialPlanets.map(planet);
  var solver = solverFactory(planets);
  var renderer = rendererFactory(planets);

  var interval = null;

  function start() {
    console.profile();
    interval = setInterval(function () {
      time += step;
      solver.step(step);
      renderer.frame(time);
      if(time > 2.5) {
        console.profileEnd();
      }
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
