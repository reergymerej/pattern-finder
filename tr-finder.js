'use strict';

var fs = require('fs'),
    path = require('path'),
    patternFinder = require('./pattern-finder');

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