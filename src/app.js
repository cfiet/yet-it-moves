var rand = require("./utils/random"),
    simulationFactory = require("./simulation"),
    canvasRendererFactory = require("./renderer/canvas"),
    eulerSolverFactory = require("./solver/euler"),
    simulation;

function createPlanets(number, width, height) {
  var planets = new Array(number),
      i;

  for(i = 0; i < number; i++) {
    planets[i] = {
      position: {
        x: rand.random(0, width),
        y: rand.random(0, height)
      },
      speed: {
        x: rand.random(-2, 2),
        y: rand.random(-2, 2)
      },
      mass: rand.random(5, 50)
    }
  }

  return planets;
}


window.yim = {
  run: function(settings) {
    settings = settings || {};

    var seed = settings.seed;
    seed = seed || Math.round(Math.random() * (2 << 15));
    console.debug("Seed: ", seed);
    rand.setSeed(seed);

    var canvas = settings.canvas;
    if(!canvas) {
      throw new Error("Canvas are required");
    }

    var planetNumber = settings.planets || 512;
    var planets = createPlanets(planetNumber, canvas.width, canvas.height);

    simulation = simulationFactory(planets,
      eulerSolverFactory,
      canvasRendererFactory.bind(null, settings.canvas));

    simulation.start();
  },
  start: function() {
    simulation.start();
  },
  stop: function () {
    simulation.stop();
  }
  require: require
};
