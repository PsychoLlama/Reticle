/* eslint-disable no-bitwise */
'use strict';

/*
  A simple javascript hash function,
  shamelessly copied from:

  http://werxltd.com/wp/2010/05/13/
  javascript-implementation-of-javas-string-hashcode-method/
*/

module.exports = function hash (string) {

  // basic validation
  if (!string) {
    return '';
  }

  // just making sure it's a string
  string = String(string);

  // the resulting hash
  let result = 0;

  // each letter...
  string.split('').forEach(function (letter) {

    /*
      find it's value, randomize it,
      and store it in the result.
    */
    const char = letter.charCodeAt(0);
    result = ((result << 5) - result) + char;
    result &= result;

  });

  return `${result.toString(36)}:`;
};
