'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-forever');

  grunt.initConfig({
    mochaTest: {
      normal: ['server/test/**/*_test.js']
    },
    forever: {
      options: {
        index: 'server/app.js'
      }
    }
  });
  grunt.registerTask('build', function(){
    var exec = require('child_process').exec;
    var done = grunt.task.current.async();
    exec('cd markdown2impress && cpanm --installdeps .', function(err, stdout, stderr) {
      grunt.log.writeln('BUILD INSTALL DEPS');
      grunt.log.writeln('stdout: ' + stdout);
      grunt.log.writeln('stderr: ' + stderr);
      if (stderr) {
        err = 1;
      }
      done(err);
    });
  });

  grunt.registerTask('create:user', function(){
      grunt.log.writeln('CREATE USER');
      var username = grunt.option('user') || grunt.log.error("NO USERNAME, grunt create:user --user=<username> --pass=<password>");
      var password = grunt.option('pass') || grunt.log.error("NO PASSWORD, grunt create:user --user=<username> --pass=<password>");
      grunt.log.writeln('USER = %s, PASS = %s', username, password);
      var userjson = {};
      userjson[username] = password;
      grunt.file.write('server/conf/userdata.json', JSON.stringify(userjson));
      grunt.log.writeln('done');
  });

  grunt.registerTask('server:test', 'mochaTest');

  grunt.registerTask('create', function(){
    grunt.log.writeln('CREATE PRESENTATION');
    var file = grunt.option('file') || grunt.log.error("NO FILE, grunt create --file=<filepath> --socket_url=<socket.io.url>");
    var socket_url = grunt.option('socket_url');
    var exec = require('child_process').exec;
    var done = grunt.task.current.async();
    exec('./markdown2impress.pl ' + file + ' ' + socket_url, function(err, stdout, stderr) {
      grunt.log.writeln('stdout: ' + stdout);
      grunt.log.writeln('stderr: ' + stderr);
      if (stderr) {
        err = 1;
      }
      done(err);
    });
  });

  grunt.registerTask('clean', function(){
    grunt.log.writeln('CLEAN PRESENTATION');
    var exec = require('child_process').exec;
    var done = grunt.task.current.async();
    exec('rm -rf js && rm -rf css && rm index.html', function(err, stdout, stderr) {
      grunt.log.writeln('stdout: ' + stdout);
      grunt.log.writeln('stderr: ' + stderr);
      if (stderr) {
        err = 1;
      }
      done(err);
    });
  });

  grunt.registerTask('watchImpress', function(){
    grunt.log.writeln('WATCH IMPRESS AND IF CHANGED, INDEX.HTML IS RECREATED');
    var file = grunt.option('file') || grunt.log.error("NO FILE, grunt create --file=<filepath> --socket_url=<socket.io.url>");
    var socket_url = grunt.option('socket_url');
    var exec = require('child_process').exec;
    var done = grunt.task.current.async();
    exec('./markdown2impress.pl ' + file + ' -r ' + socket_url, function(err, stdout, stderr) {
      grunt.log.writeln('stdout: ' + stdout);
      grunt.log.writeln('stderr: ' + stderr);
      if (stderr) {
        err = 1;
      }
      done(err);
    });
  });
};
