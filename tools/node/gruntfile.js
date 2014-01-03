module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: '\r\n\r\n'
      },
      dist: {
        src: ['../../CollidR/Scripts/CollidR/CollidR.Core.js',
              '../../CollidR/Scripts/CollidR/CollidR.stringDictionary.js', 
              '../../CollidR/Scripts/CollidR/CollidR.Formatters.Bootstrap.js'],
        dest: '../../CollidR/Scripts/CollidR.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! CollidR.js <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '../../CollidR/Scripts/CollidR.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'uglify']);
};