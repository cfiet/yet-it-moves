module.exports = function(grunt) {
  grunt.initConfig({
    bower: {
      layout: "byComponent"
    },
    copy: {
      main: {
        files: [
          { expand: true, cwd: "assets/", src: ["*"], dest: "lib/" }
        ]
      }
    },
    clean: [
      "lib"
    ],
    browserify: {
      main: {
        files: {
          "lib/planets.js": ["src/**/*.js"]
        }
      }
    },
    connect: {
      main: {
        options: {
          port: 10129,
          livereload: true,
          open: true,
          base: "lib"
        }
      }
    },
    watch: {
      main: {
        files: ["src/**/*.js", "assets/*", "bower.json"],
        tasks: "build",
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks("grunt-bower-task");
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask("build", ["bower", "copy", "browserify"]);
  grunt.registerTask("default", ["build", "connect", "watch"]);
};
