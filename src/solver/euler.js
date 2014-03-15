"use strict";

var G = function () {
    return 25;
  },
  vector2 = require("../vector");

function accellerationBetweenPlanets(current, other) {
  var difference = other.position().clone().sub(current.position());
  var distance = difference.length();
  var unit = difference.toUnit();

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

  nextSpeed = currentPlanet.speed().clone().add(acceleration.mul(step));
  nextPosition = currentPlanet.position().clone().add(currentPlanet.speed().mul(step));

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
