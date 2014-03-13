"use strict";

var G = function () {
    return 1;
  },
  vector2 = require("../vector");

function accellerationBetweenPlanets(current, other) {
  var distance = current.position().sub(other.position()).length();
  return other.mass() * G() / (distance*distance)
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
    accelleration = accelleration.add(currentAcc);
  }

  nextSpeed = currentPlanet.speed() + accelleration * step;
  nextPosition = currentPlanet.position() + currentPlanet.speed() * step;

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

module.exports = {
  solver: solver
}
