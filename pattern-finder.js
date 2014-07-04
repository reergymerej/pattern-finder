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

/**
* Finds the index of the matching closing parenthesis.
* @param {String} text assumes first char is (
* @return {Number}
*/
var findMatchingParen = function (text) {
    var closeIndex,
        currentIndex = 1,
        currentChar,
        innerClosingParenIndex;

    while (currentIndex < text.length && closeIndex === undefined) {
        currentChar = text.charAt(currentIndex);
        
        // TODO: handle quotes

        switch (currentChar) {
            case ')':
                closeIndex = currentIndex;
                break;
            case '(':
                innerClosingParenIndex = findMatchingParen(text.substr(currentIndex));
                if (innerClosingParenIndex) {
                    currentIndex += innerClosingParenIndex;
                }
            /* falls through */
            default:
                currentIndex++;
        }
    }

    return closeIndex;
};


// 5
// console.log(findMatchingParen('(asdf)'));
// // undefined
// console.log(findMatchingParen('(asdf'));
// 7
// console.log(findMatchingParen('(a(sd)f))'));
// 9
// console.log(findMatchingParen('(a(sd)(f))'));
// undefined
console.log(findMatchingParen('(a(sd)(f)'));


// console.log(findTR(text));


/*

(\((.|\n)*\))



\(.*(\(.*\))*.*\)
*/