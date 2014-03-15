(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var rand = require("./utils/random"),
    simulationFactory = require("./simulation"),
    canvasRendererFactory = require("./renderer/canvas"),
    eulerSolverFactory = require("./solver/euler");

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

    var planetNumber = settings.planets || 3;
    var planets = createPlanets(planetNumber, canvas.width, canvas.height);

    var simulation = simulationFactory(planets,
        eulerSolverFactory,
        canvasRendererFactory.bind(null, settings.canvas));

    simulation.start();
  },
  require: require
};

},{"./renderer/canvas":3,"./simulation":4,"./solver/euler":5,"./utils/random":6}],2:[function(require,module,exports){
"use strict";

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
    update: function(p, s) {
      position = p;
      speed = s;
    },
    toJSON: function () {
      return {
        position: position.toJSON(),
        speed: speed.toJSON(),
        mass: mass
      };
    }
  }
}

module.exports = planet;

},{"./vector":8}],3:[function(require,module,exports){
"use strict";

var random = require("../utils/random").random;

function canvasPlanet(planet, context) {
  var radius = 5 + (planet.mass() * 5) / 27;

  var red = Math.round(random(128, 255));
  var green = Math.round(random(128, 255));
  var blue = Math.round(random(128, 255));

  var alpha = 0.9;

  return {
    draw: function () {
      context.beginPath();
      context.arc(planet.position().x(), planet.position().y(), radius, 2 * Math.PI, false);
      context.fillStyle = "rgb("+red+","+green+","+blue+")";
      context.fill();
    }
  };
}

function canvasRenderer(canvas, planets) {
  var context = canvas.getContext("2d");
  var canvasPlanets = planets.map(function (p) {
    return canvasPlanet(p, context);
  });

  return {
    frame: function () {
      context.clearRect(0, 0, canvas.width, canvas.height);

      canvasPlanets.map(function (p) {
        p.draw();
      });
    }
  };
}

module.exports = canvasRenderer;

},{"../utils/random":6}],4:[function(require,module,exports){
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

},{"./planet":2}],5:[function(require,module,exports){
"use strict";

var G = function () {
    return 25;
  },
  vector2 = require("../vector");

function accellerationBetweenPlanets(current, other) {
  var distance = current.position().sub(other.position()).length();
  var unit = other.position().sub(current.position()).unit();

  if(distance === 0) {
    return vector2();
  }

  return unit.mul(other.mass() * G() / (distance*distance));
}

function eulerSolution(step, currentPlanet, allPlanets) {
  var nextPosition, nextSpeed, planet, currentAcc, i;
  var acceleration = vector2();

  for(i = 0; i < allPlanets.length; i++) {
    if(currentPlanet === planet) {
      continue;
    }
    planet = allPlanets[i];
    currentAcc = accellerationBetweenPlanets(currentPlanet, planet);
    acceleration = acceleration.add(currentAcc);
  }

  nextSpeed = currentPlanet.speed().add(acceleration.mul(step));
  nextPosition = currentPlanet.position().add(currentPlanet.speed().mul(step));

  return {
    apply: function () {
      currentPlanet.update(nextPosition, nextSpeed);
    }
  };
}

function solver(planets) {
  return {
    step: function (delta) {
      var solutions = planets.map(function (p) {
        return eulerSolution(delta, p, planets);
      });

      solutions.map(function (p) {
        p.apply();
      });
    }
  };
}

module.exports = solver;

},{"../vector":8}],6:[function(require,module,exports){
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

    return min + r * (max-min);
  }
}

},{}],7:[function(require,module,exports){
"use strict";

var requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

module.exports = requestAnimFrame;

},{}],8:[function(require,module,exports){
"use strict";

function vector2(data) {
  data = data || {};

  var xValue = typeof data.x === "function" && data.x()
    || typeof data.x === "number" && data.x
    || 0.0;

  var yValue = typeof data.y === "function" && data.y()
    || typeof data.y === "number" && data.y
    || 0.0;

  return {
    x: function () {
      return xValue;
    },
    y: function () {
      return yValue;
    },
    length: function () {
      var x = this.x(),
          y = this.y();
      return Math.sqrt(x*x + y*y);
    },
    unit: function () {
      var l = this.length();

      return vector2({
        x: this.x() / l,
        y: this.y() / l
      });
    },
    add: function (r) {
      return vector2({
        x: this.x() + r.x(),
        y: this.y() + r.y()
      });
    },
    mul: function (a) {
      return vector2({
        x: this.x() * a,
        y: this.y() * a
      });
    },
    sub: function (r) {
      var rrev = r.mul(-1);
      return this.add(rrev);
    },
    toJSON: function () {
      return {
        x: this.x(),
        y: this.y()
      };
    }
  };
};

module.exports = vector2;

},{}]},{},[1,2,3,4,5,6,7,8])