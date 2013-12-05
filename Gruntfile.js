/*jslint node:true*/
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        watch: {
            colors: {
                files: [ 'builder.js' ],
                tasks: [ 'colors' ]
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
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('all', ['colors', 'jade']);
    grunt.registerTask('colors', function () {
        var done = this.async(),
            builder = require('./builder');
        builder(done, 'build/colors.json');
    });
};