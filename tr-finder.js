'use strict';

var fs = require('fs'),
    path = require('path'),
    patternFinder = require('./pattern-finder');

var file = path.join(__dirname, 'strings.txt');
var text = fs.readFileSync(file, 'utf-8');

var trRegex = /\sTR\(/;
var lastIndex = 0;

var escapeRegExp = function (string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

var TR = function (rawArguments) {
    this.parse(rawArguments);
};

TR.prototype.parse = function (rawArguments) {
    this.parseSymbol(rawArguments);
    this.value = this.getValue(rawArguments);
};

TR.prototype.parseSymbol = function (rawArguments) {
    var regex = /['"]([a-zA-Z]+)\.(.+)['"]$/;
    var symbol = rawArguments.match(regex);

    if (symbol) {
        this.fullSymbol = symbol[0];
        this.context = symbol[1];
        this.symbol = symbol[2];
    }
};

TR.prototype.getValue = function (rawArguments) {
    var value,
        escapedFullSymbol,
        symbolRegex;

    if (this.fullSymbol) {
        escapedFullSymbol = escapeRegExp(this.fullSymbol);
        symbolRegex = new RegExp(',\\s+' + escapedFullSymbol + '$');
        value = rawArguments.replace(symbolRegex, '');
    } else {
        value = rawArguments;
    }

    return value;
};

/**
* @return {TR}
*/
var findTR = function (text) {
    var tr;
    var rawText;
    var startIndex;
    var relativeEndIndex;

    // trim off the bit of the text we've handled
    text = text.substring(lastIndex);

    startIndex = text.search(trRegex);

    if (startIndex !== -1) {

        // move up to the (
        startIndex += 3;
        
        relativeEndIndex = patternFinder.findMatching(text.substring(startIndex));

        if (relativeEndIndex) {
            // remove the ()
            rawText = text.substring(startIndex + 1, startIndex + relativeEndIndex);

            // move the pointer
            lastIndex += startIndex + relativeEndIndex;

            tr = new TR(rawText);
        }
    }

    return tr;
};

var findAllTRsInText = function (text) {
    var tr;
    var x = 500;
    var matches = [];
    lastIndex = 0;

    tr = findTR(text);
    while (x && tr) {
        x--;

        matches.push(tr);

        tr = findTR(text);
    }

    return matches;
};

exports.findAllTRsInText = findAllTRsInText;
