module.exports = function(grunt) {

  grunt.registerTask('watch', ['watch']);

  grunt.initConfig({
    watch: {
      all: {
        options: {
          livereload: true
        },
        files: ['**/*.*']
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};