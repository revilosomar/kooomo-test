// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // all of our configuration will go here

    clean: {
      all: ['assets/css', 'assets/js'],
      js:  ['assets/js'],
      css: ['assets/css']
    },

    // configure jshint to validate js files -----------------------------------
    jshint: {
      options: {
        reporter: require('jshint-stylish'), // use jshint-stylish to make our errors look and read good
        'esversion': 6,
      },

      // when this task is run, lint the Gruntfile and all js files in src
      build: ['Gruntfile.js', 'src/js/*.js']
    },
    // Configure Uglify to minify js files -------------------------------------
    terser: {
        options: {
          // Task-specific options go here.
          sourceMap: true
        },
        main: {
          files: {
            'assets/js/scripts.js': ['src/js/scripts.js'],
          }
        },
      },
    // compile SASS stylesheets to css -----------------------------------------
    sass: {
      dist: {
        files: {
          //'assets/css/styles.css' : 'src/css/*.scss'
          'assets/css/styles.css' : 'src/css/styles.scss'
        }
      }
    },

    // configure cssmin to minify css files ------------------------------------
    cssmin: {
      options: {
        // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
        //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
        compatibility: 'ie8',
        keepSpecialComments: '*',
        advanced: false
      },
      minifyCore: {
        src: ['src/css/third-party/bootstrap/bootstrap.css', 'src/css/third-party/font-awesome/font-awesome.css', 'assets/css/styles.css'],
        dest: 'assets/css/styles.min.css'
      },
      minifyCoreIE: {
        src: ['src/css/third-party/bootstrap/bootstrap.css', 'src/css/third-party/font-awesome/font-awesome.css', 'assets/css/styles.css'],
        dest: 'assets/css/ie.min.css'
      }
    },

    copy: {
      dist: {
        files: {
          'assets/js/jquery-3.1.1.min.js': 'src/js/copy/jquery-3.1.1.min.js',
          'assets/js/bootstrap.min.js': 'src/js/copy/bootstrap.min.js',
        }
      }
    },

   watch: {
      css: {
        files: 'src/css/inc/*.scss',
        tasks: ['clean:css', 'sass', 'cssmin']
      },
      js: {
        files: 'src/js/*.js',
        tasks: ['clean:js', 'jshint', 'terser', 'copy']
      }
    }

  });

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-terser');


  // ============= // CREATE TASKS ========== //
  grunt.registerTask('default', ['clean:all', 'jshint', 'terser', 'sass', 'cssmin', 'copy']);



};

