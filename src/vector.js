"use strict";

function Vector2(data) {
  data = data || {};

  this._x = typeof data.x === "function" && data.x()
    || typeof data.x === "number" && data.x
    || 0.0;

  this._y = typeof data.y === "function" && data.y()
    || typeof data.y === "number" && data.y
    || 0.0;
}

Vector2.prototype = {
  x: function () {
    return this._x;
  },
  y: function () {
    return this._y;
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
    this._x = v.x() + this.x();
    this._y = v.y() + this.y();
    return this;
  },
  add: function (v) {
    this._x += v.x();
    this._y += v.y();
    return this;
  },
  rSub: function (v) {
    this._x = v.x() - this.x();
    this._y = v.y() - this.y();
    return this;
  },
  sub: function (v) {
    this._x -= v.x();
    this._y -= v.y();
    return this;
  },
  mul: function (a) {
    this._x = this.x() * a;
    this._y = this.y() * a;
    return this;
  },
  div: function (a) {
    this._x = this.x() / a;
    this._y = this.y() / a;
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
    this._x = v.x();
    this._y = v.y();
    return this;
  }
};

function createVector(data) {
  return new Vector2(data);
};

module.exports = createVector;
