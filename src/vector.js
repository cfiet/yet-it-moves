"use strict";

function Vector2(data) {
  data = data || {};

  this._v = new Float32Array(2);

  this._v[0] = typeof data.x === "function" && data.x()
    || typeof data.x === "number" && data.x
    || 0.0;

  this._v[1] = typeof data.y === "function" && data.y()
    || typeof data.y === "number" && data.y
    || 0.0;
}

Vector2.prototype = {
  x: function () {
    return this._v[0];
  },
  y: function () {
    return this._v[1];
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
    this._v[0] = v.x() + this.x();
    this._v[1] = v.y() + this.y();
    return this;
  },
  add: function (v) {
    this._v[0] += v.x();
    this._v[1] += v.y();
    return this;
  },
  rSub: function (v) {
    this._v[0] = v.x() - this.x();
    this._v[1] = v.y() - this.y();
    return this;
  },
  sub: function (v) {
    this._v[0] -= v.x();
    this._v[1] -= v.y();
    return this;
  },
  mul: function (a) {
    this._v[0] = this.x() * a;
    this._v[1] = this.y() * a;
    return this;
  },
  div: function (a) {
    this._v[0] = this.x() / a;
    this._v[1] = this.y() / a;
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
    this._v[0] = v.x();
    this._v[1] = v.y();
    return this;
  }
};

function createVector(data) {
  return new Vector2(data);
};

module.exports = createVector;
