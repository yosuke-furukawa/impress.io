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
    var locallib = grunt.option('local-lib');
    if (locallib) {
      locallib = "--local-lib=" + locallib;
    } else {
      locallib = "";
    }
    var force = grunt.option('force');
    if (force) {
      force = "--force";
    } else {
      force = "";
    }
    var exec = require('child_process').exec;
    var done = grunt.task.current.async();
    exec('cd markdown2impress && cpanm --installdeps . ' + locallib + ' ' + force, function(err, stdout, stderr) {
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

  var createUsage = function(message) {
    grunt.log.error(message + " grunt createImpress/watchImpress  --file=<filepath, required> --width=<width, default=1200> --height=<height, default=800> --max_column=<maxcolumn default=5> --output_dir=<output directory, default='./public'> --socket_url=<socket.io.url, default='http://localhost:3000/'>");
  };
  var createArgs = function() {
    var file = grunt.option('file') || createUsage("NO FILE");
    var width = grunt.option('width') || "";
    width = typeof width === 'number' ? "--width="+width : "";
    var height = grunt.option('height') || "";
    height = typeof height === 'number' ? "--height="+height : "";
    var max_column = grunt.option('max_column') || "";
    max_column = typeof max_column === 'number' ? "--max_column="+max_column : "";
    var outputdir = grunt.option('outputdir') || "./public";
    outputdir = outputdir ? "--outputdir="+outputdir : "";
    var socket_url = grunt.option('socket_url');
    socket_url = socket_url ? "--socket_url="+socket_url : "";
    var args = [file, width, height, max_column, outputdir, socket_url];
    grunt.log.writeln(args.join(" "));
    return args.join(" ");
  };

  grunt.registerTask('createImpress', function(){
    grunt.log.writeln('CREATE PRESENTATION');
    var exec = require('child_process').exec;
    var done = grunt.task.current.async();
    exec('./markdown2impress.pl ' + createArgs(), function(err, stdout, stderr) {
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
    exec('rm -rf public', function(err, stdout, stderr) {
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
    var exec = require('child_process').exec;
    var done = grunt.task.current.async();
    exec('./markdown2impress.pl ' + createArgs() + ' -r ', function(err, stdout, stderr) {
      grunt.log.writeln('stdout: ' + stdout);
      grunt.log.writeln('stderr: ' + stderr);
      if (stderr) {
        err = 1;
      }
      done(err);
    });
  });
};
