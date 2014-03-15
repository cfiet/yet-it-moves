"use strict";

var allocations = 0;

function createVector(data) {
  allocations++;
  data = data || {};

  var xValue = typeof data.x === "function" && data.x()
    || typeof data.x === "number" && data.x
    || 0.0;

  var yValue = typeof data.y === "function" && data.y()
    || typeof data.y === "number" && data.y
    || 0.0;

  function Vector2() {
  }

  Vector2.prototype = {
    x: function () {
      return xValue;
    },
    y: function () {
      return yValue;
    },
    length: function () {
      return Math.sqrt(this.lengthSquare());
    },
    lengthSquare: function () {
      var x = this.x(),
          y = this.y();
      return x*x + y*y;
    },
    clone: function () {
      return createVector({
        x: this.x(),
        y: this.y()
      });
    },
    rAdd: function (v) {
      xValue = v.x() + xValue;
      yValue = v.y() + yValue;
      return this;
    },
    add: function (v) {
      xValue += v.x();
      yValue += v.y();
      return this;
    },
    rSub: function (v) {
      xValue = v.x() - xValue;
      yValue = v.y() - yValue;
      return this;
    },
    sub: function (v) {
      xValue -= v.x();
      yValue -= v.y();
      return this;
    },
    mul: function (a) {
      xValue = xValue * a;
      yValue = yValue * a;
      return this;
    },
    div: function (a) {
      xValue = xValue / a;
      yValue = yValue / a;
      return this;
    },
    toUnit: function () {
      var l = this.length();
      return this.div(l);
    },
    toJSON: function () {
      return {
        x: this.x(),
        y: this.y()
      };
    },
    update: function (v) {
      xValue = v.x();
      yValue = v.y();
      return this;
    }
  };

  return new Vector2();
};

createVector.getAllocations = function () {
  var a = allocations;
  allocations = 0;
  return a;
}

module.exports = createVector;
