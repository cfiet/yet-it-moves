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
      var x = this.x(),
          y = this.y();
      return Math.sqrt(x*x + y*y);
    },
    unit: function () {
      var l = this.length();

      return createVector({
        x: this.x() / l,
        y: this.y() / l
      });
    },
    add: function (r) {
      return createVector({
        x: this.x() + r.x(),
        y: this.y() + r.y()
      });
    },
    mul: function (a) {
      return createVector({
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

  return new Vector2();
};

createVector.getAllocations = function () {
  var a = allocations;
  allocations = 0;
  return a;
}

module.exports = createVector;
