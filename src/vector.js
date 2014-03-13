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
      this.add(rrev);
    }
  };
};

module.exports = {
  vector2: vector2
};
