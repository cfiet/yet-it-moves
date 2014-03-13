module.exports = function(grunt) {
  grunt.initConfig({
    bower: {
      layout: "byComponent"
    }
  });

  grunt.loadNpmTasks("grunt-bower-task");

  grunt.registerTask("default", ["bower"]);
};
