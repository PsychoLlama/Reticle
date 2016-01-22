/*globals describe, it, expect, jasmine*/
/*jslint node: true*/
'use strict';

var Gun = require('gun/gun');
var gun = new Gun({ file: false });
var reticle = require('../index');

describe('Reticle', function () {

  it('should export a function', function () {
    expect(reticle).toEqual(jasmine.any(Function));
  });

  it('should return the Gun constructor', function () {
    var result = reticle(Gun);
    expect(result).toBe(Gun);
  });

  it('should add a "scope" method to the gun constructor', function () {
    expect(Gun.scope).toEqual(jasmine.any(Function));
  });

  it('should add a "scope" method to the gun chain', function () {
    expect(Gun.chain.scope).toEqual(jasmine.any(Function));
  });

  it('should return the execution context', function () {
    expect(gun.scope('test') instanceof Gun).toBe(true);
  });

});
