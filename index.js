'use strict';

const hash = require('./lib/hash');
const scope = '\u2316';
let preset = '';
let Gun;

try {
  Gun = window.Gun;
} catch (err) {
  Gun = require('gun/gun');
}

function find (chain, cb) {
  let val;

  if (!Gun.is(chain)) {
    return undefined;
  }

  while (Gun.is(chain)) {
    if ((val = cb(chain)) !== undefined) {
      return val;
    }
    if (chain === chain.back) {
      break;
    }
    chain = chain.back;
  }

  return undefined;
}

function findScope (gun) {

  let found = find(gun, function (chain) {
    return chain._[scope];
  });

  found = typeof found === 'string' ? found : gun.__[scope];

  return found || '';
}

function prefix (gun, name) {

  // if name is a string, prefix it with a scope
  if (typeof name === 'string') {

    // find the prefix
    const scope = findScope(gun);
    const match = new RegExp(`^${scope}`);

    // only prefix once
    if (!name.match(match)) {
      name = scope + name;
    }

  } else if (Gun.obj.is(name)) {
    if (!name['#']) {
      return name;
    }
    name['#'] = prefix(gun, name['#']);
    return name;
  }

  return name;
}


Gun.scope = function (name) {
  if (typeof name === 'string') {
    preset = hash(name);
  }
  return Gun;
};

// each new instance, set a starting scope
Gun.on('opt').event(function (gun) {
  gun.__[scope] = gun.__[scope] || preset;
});

// add the `scope` method
Gun.chain.scope = function (name) {
  const gun = this.chain();

  if (typeof name === 'string') {

   /*
     Hash the name and keep it as a string.
     This is used in `.get`.
   */
    gun._[scope] = hash(name);
  }
  if (name === null) {
    gun._[scope] = '';
  }

  return gun;
};


/*
 * wrap the `.key`
 * and `.get` methods
 * to prefix the keys
 */

Gun.chain.get = (function () {

  // keep a reference to the real `get` method
  const get = Gun.chain.get;

  return function (name, cb, opt) {

   // apply a scope
    name = prefix(this, name);

   // invoke the original `get` method
    return get.call(this, name, cb, opt);
  };
}());

Gun.chain.key = (function () {

  // keep a reference to the original `key` method
  const key = Gun.chain.key;

  return function (name, cb, opt) {

    name = prefix(this, name);

    return key.call(this, name, cb, opt);
  };
}());

Gun.chain.put = (function () {
  const put = Gun.chain.put;

  return function () {

    Gun.text.random.scope = findScope(this);
    return put.apply(this, arguments);
  };
}());

Gun.text.random = (function () {
  const random = Gun.text.random;

  return function (length, chars) {

    const scope = Gun.text.random.scope;
    return scope + random.call(this, length, chars);
  };
}());

Gun.text.random.scope = '';

module.exports = Gun;
