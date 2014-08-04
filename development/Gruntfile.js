module.exports = function(grunt) {
 
  grunt.registerTask('watch', [ 'watch' ]);
 
  grunt.initConfig({
    requirejs: {
	  compile: {
	    options: {
	      baseUrl: "path/to/base",
	      mainConfigFile: "path/to/config.js",
	      name: "path/to/almond", // assumes a production build using almond
	      out: "path/to/optimized.js"
	    }
	  }
	},
    watch: {
      js: {
        files: ['./*.js'],
        tasks: ['requirejs:js'],
        options: {
          livereload: true,
        }
      },
      css: {
        files: ['less/*.less'],
        tasks: ['less:style'],
        options: {
          livereload: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
};
