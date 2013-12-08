/*jslint node:true*/
var builder = function (data, done) {
    'use strict';
    var fs = require('fs'),
        xml2js = require('xml2js'),
        parser = new xml2js.Parser(),
        colors = [];

    parser.parseString(data, function (err, result) {
        if (err) {
            return done(err);
        }
        
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
            
            done(null, colors);
        });
        
    });
};

module.exports = builder;
