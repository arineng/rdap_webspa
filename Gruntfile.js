/**
 *
 * Copyright (C) 2015-2016 ARIN
 * Created by andy on 1/28/15.
 */
module.exports = function ( grunt )
{
  grunt.initConfig( {
    pkg: grunt.file.readJSON( 'package.json' ), // the package file to use

    qunit: {
      all: ['tests/*.html']
    }
  } );

// load up your plugins
  grunt.loadNpmTasks('grunt-contrib-qunit');

// register one or more task lists (you should ALWAYS have a "default" task list)
  grunt.registerTask('default', ['qunit']);
};
