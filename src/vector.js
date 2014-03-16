"use strict";

var zero = { x: 0, y : 0 },
    POOL_SIZE = 2 << 16,
    pool;

function VectorPool(size) {
  this.vectors = new Array(size);
  this.last = size-1;

  var i,
      buffer = new Float32Array(size * 2);

  for(i = 0; i < size; i++) {
    this.vectors[i] = new Vector2(buffer.subarray(i*2, i*2 + 2));
  }
}

VectorPool.prototype = {
  aquire: function(data) {
    data = data || zero;
    if(this.last < 0) {
      throw new Error("Vector pool is emtpy");
    }

    var v = this.vectors[this.last];
    this.vectors[this.last] = undefined;
    this.last -= 1;

    v.updatePlain(data);
    v.aquire();

    return v;
  },
  release: function (v) {
    v.reset();
    this.last += 1;
    this.vectors[this.last] = v;
  }
}

function Vector2(buffer) {
  this._v = buffer;
  this._aquires = 0;
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
  },
  updatePlain: function (v) {
    this._v[0] = v.x;
    this._v[1] = v.y;
    return this;
  },
  reset: function () {
    this._v[0] = 0;
    this._v[1] = 0;
  },
  aquire: function () {
    this._aquires++;
  },
  dispose: function () {
    this._aquires--;
    if(this._aquires <= 0) {
      pool.release(this);
    }
  }
};

function createVector(data) {
  return pool.aquire(data);
};

pool = new VectorPool(POOL_SIZE);

module.exports = createVector;
