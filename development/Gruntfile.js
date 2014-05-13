module.exports = function(grunt) {
	var deployPath = "../iOS/www/";

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		concat : {
			options : {
				separator : ''
			},
			app : {
				src : ['js/app/**/*.js'],
				dest : deployPath + 'js/app/program_files.js'
			},
			libs : {
				src : ['js/libs/jquery.js', 'js/libs/underscore.js' , 'js/libs/backbone.js', 'js/libs/backbone.marionette.min.js', 'js/libs/click-events.js', 'js/libs/jquery.featureCarousel.min.js', 'js/libs/jquery.miniTip.min.js'],
				dest : deployPath + 'js/libs/libs.js'
			},
			core : {
				src : ['js/app.js', 'js/routes.js', 'js/regions.js', 'js/settings/config.js', 'js/app_controller.js'],
				dest : deployPath + 'js/core.js'
			},
			css : {
				src : ['css/normalize.css', 'css/layout.css', 'css/style.css', 'css/header.css','css/footer.css', 'css/buttons.css','css/legal.css','css/glossary.css','css/tooltip.css','css/popup.css','css/dropdown.css','css/step1.css','css/step2.css','css/step3.css','css/horizontal-sub-nav.css','css/vertical-sub-nav.css','css/icons.css','css/graph.css','css/rickshaw.css','css/nouislider.fox.css','css/animation.css','css/it-rate-history.css','css/carousel.css','css/popup-notification.css', 'css/next-step.css' ],
				dest : deployPath + 'css/main.css'
			}
		},
		minified : {
			app : {
				src : [deployPath + 'js/app/program_files.js'],
				dest : deployPath + 'js/app/'
			},
			libs : {
				src : [deployPath + 'js/libs/libs.js'],
				dest : deployPath + 'js/libs/'
			},
			core : {
				src : [deployPath + 'js/core.js'],
				dest : deployPath + 'js/'
			},
			options : {
				//sourcemap: true,
				//allinone: false
			}
		},
		cssmin : {
			minify : {
				expand : true,
				cwd : deployPath + 'css/',
				src : ['*.css'],
				dest : deployPath + 'css/',
				ext : '.css'
			}
		}, 
		copy : {
			main : {
				files: [
				 {expand: true, src: ['font/**/*'], dest: deployPath},
				 {expand: true, src: ['images/**/*'],dest: deployPath},
				 {expand: true, src: ['json/**/*'], dest: deployPath},
				 {expand: true, src: ['templates/**/*'], dest: deployPath},
				 {expand: true, src: ['index.html'], dest: deployPath},
				 {expand: true, src: ['cache.appcache'], dest: deployPath},
				 {expand: true, src: ['css/images/*'], dest: deployPath},
				 {expand: true, src: ['css/fonts.css'], dest: deployPath},
				 {expand: true, src: ['js/libs/cordova-2.5.0.js', 'js/libs/d3.v2.js', 'js/libs/rickshaw.js', 'js/libs/jquery.nouislider.min.js', 'js/libs/Bootstrap.js'], dest: deployPath}
				]
			}
		},
		usemin: {
		  html: deployPath + 'index.html'
		}
	});

	// grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-qunit');
	// grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-minified');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-usemin');
	// grunt.loadNpmTasks('grunt-contrib-compress');
	//, 'minified'
	grunt.registerTask('default', ['concat', 'cssmin', 'minified', 'copy', 'usemin']);
}; 