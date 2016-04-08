module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /* BowerCopy
    /*--------------
    /*-------------*/
    bowercopy: {
      options: {
        clean: true,
        runBower: true,
        destPrefix: 'src/js/vendor'
      },
      jquery: {
        files: {
          'jquery': 'jquery/dist/jquery.min.js'
        }
      },
      'bourbon': {
        files: {
          '../../SCSS/vendor/elements': 'bourbon/app/assets/stylesheets'
        }
      }
    },

    /* Copy
    /*---------------
    /*---------------*/
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.html', '**/*.js', 'scss/**/*.scss', '!scss/vendor/elements/**/*'],
            dest: 'dist'
        },
      ]
      }
    },

    /* SASS Import
    /*---------------------
    /*---------------------*/
    sass_import: {
      options: {
        basePath: ''
      },
      dist: {
        files: {
          'src/SCSS/theme/_theme.SCSS': [{
            path: 'src/SCSS/theme/elements/**/*.scss'
          }],
          'src/SCSS/base/_base.SCSS': [{
            path: 'src/SCSS/base/elements/**/*.scss',
            first: 'src/SCSS/base/elements/_variables.scss'
          }]
        }
      }
    },

    /* SASS
    /----------------------
    /----------------------*/
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: 'desrcv/SCSS',
          src: ' imageslider.scss',
          dest: 'src/css',
          ext: '.css'
      }]
      },
      build: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'src/SCSS',
          src: ' imageslider.scss',
          dest: 'dist/css',
          ext: '.css'
      }]
      }
    },

    /* PostCSS Task
    /*--------------------
    /*--------------------*/
    postcss: {
      options: {
        map: true,
        processors: [
        require('pixrem')(), // add fallbacks for rem units
        require('autoprefixer')({
            browsers: 'last 3 versions'
          }), // add vendor prefixes
        require('cssnano')() // minify the result
      ]
      },
      build: {
        src: 'dist/css/*.css'
      }
    },

    /* ImageMin
    /*------------------
    /*------------------*/
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.jpg'],
            dest: 'dist/',
            ext: '.jpg'
          },
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.png'],
            dest: 'dist/',
            ext: '.png'
          },
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.ico'],
            dest: 'dist/',
            ext: '.ico'
          },
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.gif'],
            dest: 'dist/',
            ext: '.gif'
          },
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.svg'],
            dest: 'dist/',
            ext: '.svg'
          }
        ]
      }
    },

    /* Watch Task
    /*----------------------
    /*---------------------*/
    watch: {
      options: {
        livereload: true,
      },
      css: {
        files: 'src/SCSS/**/*.scss',
        tasks: ['sass_import', 'sass:build', 'postcss'],
      },
      html: {
        files: 'src/**/*.html',
        tasks: ['copy']
      },
      js: {
        files: 'src/js/**/*',
        tasks: ['copy']
      }
    },
    /* Connect
    /*--------------------
    /*--------------------*/
    connect: {
      server: {
        options: {
          port: 9001,
          base: {
            path: 'dist',
            options: {
              index: 'demo.html'
            }
          },
          //keepalive: true,
          open: true
        }
      }
    },

    /* Clean Task
    /*--------------------
    /*--------------------*/
    clean: {
      build: [
        'dist'
      ],
      bowerinit: [
        'src/js/vendor/**/*.js', 'src/SCSS/vendor/elements/*.scss', '!src/SCSS/vendor/_vendor.scss'
      ]
    },


   

    /* Bump Versions
    /--------------------------
    /-------------------------*/
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },


  });
  grunt.registerTask('default', ['']);
  grunt.registerTask('bowerinstall', ['clean:bowerinit', 'bowercopy']);
  grunt.registerTask('serve', ['connect', 'watch']);
  grunt.registerTask('build', ['clean:build', 'sass_import', 'sass:build', 'postcss', 'imagemin', 'copy'])
};