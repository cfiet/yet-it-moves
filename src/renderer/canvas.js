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
