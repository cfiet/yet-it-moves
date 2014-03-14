"use strict";

var random = require("../utils/random").random;

function canvasPlanet(planet, context) {
  var radius = mass / 10;

  var red = random(128, 255);
  var green = random(128, 255);
  var blue = random(128, 255);

  var alpha = 0.9;

  return {
    draw: function () {
      context.beginPath();
      context.arc(planet.position().x(), panet.position().y(), 0, 2 * Math.PI, false);
      context.fillStyle = "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
      context.fill();
    }
  };
}

function canvasRenreder(canvas, planets) {
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

module.exports = {
  renderer: canvasRenderer
};
