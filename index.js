/*jslint node: true, nomen: true, bitwise: true */
'use strict';

var preset, hash, Gun, scope = '\u2316';
hash = require('./lib/hash');
preset = '';

try {
	Gun = window.Gun;
} catch (e) {
	Gun = require('gun/gun');
}


function find(chain, cb) {
  var val;

  if (!Gun.is(chain)) {
		return;
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
}

function findScope(gun) {

	var found = find(gun, function (chain) {
		return chain._[scope];
	});

	found = typeof found === 'string' ? found : gun.__[scope];

	return found || '';
}

function prefix(gun, name) {

	// if name is a string, prefix it with a scope
	if (typeof name === 'string') {
		var match, scope;

		// find the prefix
		scope = findScope(gun);
		match = new RegExp('^' + scope);

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
	var gun = this.chain();

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
	var get = Gun.chain.get;

	return function (name, cb, opt) {

		// apply a scope
		name = prefix(this, name);

		// invoke the original `get` method
		return get.call(this, name, cb, opt);
	};
}());

Gun.chain.key = (function () {

	// keep a reference to the original `key` method
	var key = Gun.chain.key;

	return function (name, cb, opt) {

		name = prefix(this, name);

		return key.call(this, name, cb, opt);
	};
}());

Gun.chain.put = (function () {
	var put = Gun.chain.put;

	return function () {

		Gun.text.random.scope = findScope(this);
		return put.apply(this, arguments);
	};
}());

Gun.text.random = (function () {
	var random = Gun.text.random;

	return function (l, c) {

		var scope = Gun.text.random.scope;
		return scope + random.call(this, l, c);
	};
}());

Gun.text.random.scope = '';

module.exports = Gun;
