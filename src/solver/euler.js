"use strict";

var G = function () {
    return 25;
  },
  vector2 = require("../vector"),
  zero = vector2(),
  accelerations;

function calculateAcc(p1, p2) {
  var diff = p2.position().clone().sub(p1.position());
  var distSq = diff.lengthSquare();

  if(distSq === 0) {
    return zero;
  }

  return diff.toUnit().mul(p2.mass() * G() / distSq);
}

function accCache() {
  var cache = new Array(2 << 16);

  function getKeys(p1, p2) {
    var id1 = p1.id(),
        id2 = p2.id();

    return [
      (2 << 15) * id1 + id2,
      (2 << 15) * id2 + id1
    ];
  }

  return {
    get: function(p1, p2) {
      var keys = getKeys(p1, p2);
      var entry = cache[keys[0]] || cache[keys[1]];

      if(entry === undefined) {
        entry = cache[keys[0]] = cache[keys[1]] = calculateAcc(p1, p2);
        entry.aquire();
      } else {
        entry.mul(-p1.mass() / p2.mass())
      }

      return entry;
    },
    reset: function () {
      cache = {};
    }
  }
}

accelerations = accCache();

function accellerationBetweenPlanets(current, other) {
  return accelerations.get(current, other);
}

function eulerSolution(step, currentPlanet, allPlanets) {
  var nextPosition, nextSpeed, planet, currentAcc, i;
  var acceleration = vector2();

  for(i = 0; i < allPlanets.length; i++) {
    planet = allPlanets[i];
    if(currentPlanet.id() === planet.id()) {
      continue;
    }

    currentAcc = accellerationBetweenPlanets(currentPlanet, planet);
    acceleration = acceleration.add(currentAcc);

    currentAcc.dispose();
  }

  nextSpeed = currentPlanet.speed().clone().add(acceleration.mul(step));
  nextPosition = currentPlanet.position().clone().add(currentPlanet.speed().mul(step));

  acceleration.dispose();

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

      accelerations.reset();

      solutions.map(function (p) {
        p.apply();
      });
    }
  };
}

module.exports = solver;
