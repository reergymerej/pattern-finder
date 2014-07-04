'use strict';

var fs = require('fs'),
    path = require('path');

var file = path.join(__dirname, 'strings.txt');
var text = fs.readFileSync(file, 'utf-8');

var trRegex = /\sTR\((.|\n)+?\)/g;

var matches = text.match(trRegex) || [];

var findTR = function (text) {
    var completeTR;

    // find the beginnint of the TR
    var startIndex = text.search(/\sTR\(/g);                                

    var x = 0;
    while (x < 15) {
        console.log(text.charAt(startIndex + x));
        x++;
    }

    completeTR = text.substr(startIndex, 5);

    return completeTR;
};

var assert = function (actual, expected) {
    if (actual !== expected) {
        throw new Error('expected ' + expected + ' and got '+ actual);
    }
};


var MATCHES = {
    '<': '>',
    '(': ')',
    '{': '}',
    '[': ']'
};

/**
* Finds the index of the matching closing character.
* @param {String} text the first char is used as the "opening" character
* @param {String} [closingChar] the string that is the "closing" character,
* if not the same as the "opening" character
* @return {Number}
*/
var findMatching = function (text, closingChar) {
    var closeIndex,
        currentIndex = 1,
        currentChar,
        innerClosingIndex;

    var openingChar = text.charAt(0);
    closingChar = closingChar || MATCHES[openingChar] || openingChar;

    while (currentIndex < text.length && closeIndex === undefined) {
        currentChar = text.charAt(currentIndex);
        
        // TODO: handle quotes

        switch (currentChar) {
            case '\\':
                currentIndex += 2;
                break;
            case closingChar:
                closeIndex = currentIndex;
                break;
            case openingChar:
                innerClosingIndex = findMatching(text.substr(currentIndex), closingChar);
                if (innerClosingIndex) {
                    currentIndex += innerClosingIndex;
                }
            /* falls through */
            default:
                currentIndex++;
        }
    }

    return closeIndex;
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
assert(findMatching('"asdf"'), 5);
assert(findMatching('"as"df"'), 3);

assert(findMatching('(as\\)df)'), 7);
assert(findMatching('<div id="dude">'), 14);
