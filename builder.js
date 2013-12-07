/*jslint node:true*/
var builder = function (done, out) {
    'use strict';
    var fs = require('fs'),
        xml2js = require('xml2js'),
        parser = new xml2js.Parser(),
        colors = [];

    fs.readFile(__dirname + '/colors.xml', function (err, data) {
        parser.parseString(data, function (err, result) {
            ['drawable', 'color'].forEach(function (el) {
                result.resources[el].forEach(function (d) {
                    var hexcolor = /^#([0-9a-f]{2})?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/.exec(d._),
                        rgba,
                        alpha;
                    if (hexcolor) {
                        alpha = hexcolor[1] ?
                                Math.round(parseInt(hexcolor[1], 16) * 100 / 255) / 100 : 1;
                        rgba = [
                            parseInt(hexcolor[2], 16),
                            parseInt(hexcolor[3], 16),
                            parseInt(hexcolor[4], 16),
                            alpha
                        ];
                        colors.push({
                            name: el + '.' + d.$.name,
                            rgba: rgba,
                            hex: d._
                        });
                    }
                });
            });
            fs.writeFile(out, JSON.stringify(colors.sort(function (a, b) { return a.name.localeCompare(b.name); })), function () {
                done();
            });
        });
    });
};

module.exports = builder;