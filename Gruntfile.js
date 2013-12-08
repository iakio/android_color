/*jslint node:true*/
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        watch: {
            xml2json: {
                files: [ 'colors.xml', 'builder.js' ],
                tasks: [ 'xml2json' ]
            },
            jade: {
                files: [ 'tmpl/index.jade', 'build/colors.json' ],
                tasks: [ 'jade' ]
            }
        },
        jade: {
            options: {
                pretty: true,
                data: function () {
                    return { colors: require('./build/colors.json'), pretty: true };
                }
            },
            compile: {
                files: {
                    'dist/index.html': [ 'tmpl/index.jade' ]
                }
            }
        },
        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: '**/*'
        },
        xml2json: {
            colors: {
                files: {
                    'build/colors.json': [ 'colors.xml' ]
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('all', ['xml2json', 'jade']);
    grunt.registerMultiTask('xml2json', function () {
        var builder = require('./builder'),
            done = this.async();
        this.files.forEach(function (f) {
            var result = [],
                countDown = f.src.length;
            f.src.forEach(function (src) {
                builder(grunt.file.read(src), function (err, json) {
                    if (err) {
                        grunt.fatal(err);
                    }
                    result = result.concat(json);
                    countDown -= 1;
                    if (countDown === 0) {
                        grunt.file.write(f.dest, JSON.stringify(
                            result.sort(function (a, b) {
                                return a.name.localeCompare(b.name);
                            })
                        ));
                        done();
                    }
                });
            });
        });
    });
};
