'use strict';

var fs = require('fs'),
    path = require('path');

var MATCHES = {
    '<': '>',
    '(': ')',
    '{': '}',
    '[': ']'
};

/**
* Finds the index of the matching closing character.
* @param {String} text the first char is used as the "opening" character
* @param {String} [closingChar] the string that is the "closing" character -
* If omitted checks in MATCHES and then uses the "opening" character.
* @param {Boolean} [ignoreQuoted] ignore anything within paired quotes
* example: (blah + ")" + blah) -> This will match the last ), not the one in quotes.
* @return {Number}
*/
var findMatching = function (text, closingChar, ignoreQuoted) {
    var closeIndex,
        currentIndex = 1,
        currentChar,
        innerClosingIndex;

    var openingChar = text.charAt(0);

    closingChar = closingChar || MATCHES[openingChar] || openingChar;
    if (ignoreQuoted === undefined) {
        ignoreQuoted = true;
    }

    while (currentIndex < text.length && closeIndex === undefined) {
        currentChar = text.charAt(currentIndex);

        if (ignoreQuoted && (currentChar === '"' || currentChar === "'") &&
            currentChar !== closingChar) {
                innerClosingIndex = findMatching(text.substr(currentIndex), currentChar, ignoreQuoted);
                if (innerClosingIndex) {
                    // skip the inner pair
                    currentIndex += innerClosingIndex;
                }

                currentIndex++;
        
        } else {

            switch (currentChar) {
                // escape char, skip this and the next
                case '\\':
                    currentIndex += 2;
                    break;

                // hooray!
                case closingChar:
                    closeIndex = currentIndex;
                    break;

                // recursive
                case openingChar:
                    innerClosingIndex = findMatching(text.substr(currentIndex), closingChar, ignoreQuoted);
                    if (innerClosingIndex) {
                        // skip the inner pair
                        currentIndex += innerClosingIndex;
                    }
                    /* falls through */
                default:
                    currentIndex++;
            }
        }
    }

    return closeIndex;
};

var assert = function (actual, expected) {
    if (actual !== expected) {
        throw new Error('expected ' + expected + ' and got '+ actual);
    }
};

assert(findMatching('(asdf)'), 5);
assert(findMatching('(asdf'), undefined);
assert(findMatching('(a(sd)f))'), 7);
assert(findMatching('(a(sd)(f))'), 9);
assert(findMatching('(a(sd)(f)'), undefined);

assert(findMatching("'asdf"), undefined);
assert(findMatching("'asdf'"), 5);
assert(findMatching("'as''df'"), 3);
assert(findMatching(""), undefined);

assert(findMatching('""'), 1);
assert(findMatching('"\\""'), 3);
assert(findMatching('"asdf"'), 5);
assert(findMatching('"as"df"'), 3);

assert(findMatching('(as\\)df)'), 7);
assert(findMatching('<div id="dude">'), 14);

assert(findMatching('(asdf + ")" + qwer)'), 18);
assert(findMatching('(asdf + ")" + (blah) ? ding : qwer)'), 34);

// unpaired quotes in substring
assert(findMatching('("\')', 3));

exports.findMatching = findMatching;