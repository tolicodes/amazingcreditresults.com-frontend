module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                maxparams: 6,
                unused: true,
                immed: true,
                latedef: true,
                noempty: true,
                nonew: true,
                quotmark: 'single',
                undef: true,
                globals: {
                    window: true,
                    moment: true,
                    document: true,
                    require: true,
                    define: true
                },
                // suppress warnings about mixed spaces and tabs
                '-W099': true,
                // supress warnings about Constructors not starting with Capitals
                '-W055': true,
                // supress warning about use strict
                '-W097': true
            },
            files: ['app/js/**/*.js']
        },
        haml: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'app/partials/login.html': 'app/partials/haml/login.haml',
                    'app/partials/logout.html': 'app/partials/haml/logout.haml',
                    'app/partials/sellers.html': 'app/partials/haml/sellers.haml',
                    'app/partials/buyers.html': 'app/partials/haml/buyers.haml',
                    'app/partials/userForm.html': 'app/partials/haml/userForm.haml'
                }
            }
        },
        watch: {
            scripts: {
                files: 'app/js/**/*.js',
                tasks: 'jshint:files',
                options: {
                    atBegin: true,
                    livereload: true
                }
            },
            haml: {
                files: 'app/partials/**/*.haml',
                tasks: 'haml',
                options: {
                    atBegin: true
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-haml2html');

    grunt.registerTask('default', ['haml', 'jshint']);
};
