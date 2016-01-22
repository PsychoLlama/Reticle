/*jslint node: true, nomen: true, bitwise: true */
/*global window*/
'use strict';

var preset, hash, scope = '\u2316';
hash = require('./lib/hash');
preset = '';


function reticle(Gun) {

  Gun.scope = function (name) {
    if (typeof name === 'string') {
      preset = name;
    }
    return Gun;
  };

  // each new instance, set a starting scope
  Gun.on('opt').event(function (gun) {
    gun.__[scope] = gun.__[scope] || preset;
  });

  // add the `scope` method
  Gun.chain.scope = function (name) {

    if (typeof name === 'string') {
      /*
        Hash the name and keep it as a string.
        This is used in `.get`.
      */
      this.__[scope] = hash(name);
    }

    return this;
  };

  // wrap the `get` method with middleware
  Gun.chain.get = (function () {

    // keep a reference to the real `get` method
    var get = Gun.chain.get;

    return function (name, cb, opt) {

      // if name is a string, prefix it with a scope
      if (typeof name === 'string') {
        name = this.__[scope] + ':' + name;
      }
      console.log(name);

      // invoke the original `get` method
      return get.call(this, name, cb, opt);
    };
  }());

  return Gun;
}

/*
  If `Gun` is global, run automatically.
  This prevents exposing a global in the window,
  since we already have access to `Gun`.
*/
if (typeof window !== 'undefined') {
  reticle(window.Gun);
}

module.exports = reticle;
