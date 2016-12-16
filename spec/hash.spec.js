/* globals describe, it, expect, jasmine*/
'use strict';

const hash = require('../lib/hash');

describe('The string hasher', function () {

  it('should be a function', function () {
    expect(hash).toEqual(jasmine.any(Function));
  });

  it('should return a string', function () {
    expect(hash()).toEqual(jasmine.any(String));
    expect(hash('')).toEqual(jasmine.any(String));
    expect(hash('J')).toEqual(jasmine.any(String));
  });

  it('should return a unique value for different input', function () {
    expect(hash('1')).not.toBe(hash('2'));
    expect(hash('hi')).not.toBe(hash('bye'));
  });

  it('should be case and space sensitive', function () {
    expect(hash('HI')).not.toBe(hash('hi'));
    expect(hash('h i')).not.toBe(hash('hi'));
    expect(hash('hi')).toBe(hash('hi'));
    expect(hash('h i')).toBe(hash('h i'));
    expect(hash('HI')).toBe(hash('HI'));
  });

  it('should return the same value for the same input', function () {
    expect(hash('1')).toBe(hash('1'));
    expect(hash('2')).toBe(hash('2'));
    expect(hash('hi')).toBe(hash('hi'));
    expect(hash('bye')).toBe(hash('bye'));
  });

  it('should append a colon', function () {
    expect(hash('test').slice(-1)).toBe(':');
  });

  it('should not append a colon to empty input', function () {
    expect(hash().slice(-1)).not.toBe(':');
  });

});
