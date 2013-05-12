'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    mochaTest: {
      normal: ['server/test/**/*_test.js']
    },
    server: {
      options: {
        outlog: __dirname + '/server/logs/out.log',
        errlog: __dirname + '/server/logs/err.log',
      }
    }
  });

  grunt.registerTask('build', "build markdown2impress", function(){
    var options = grunt.option.flags().join(" ");
    var exec = require('child_process').exec;
    var done = grunt.task.current.async();
    exec('cd markdown2impress && cpanm --installdeps . ' + options, function(err, stdout, stderr) {
      grunt.log.writeln('BUILD INSTALL DEPS');
      grunt.log.writeln('stdout: ' + stdout);
      grunt.log.writeln('stderr: ' + stderr);
      if (stderr) {
        err = 1;
      }
      done(err);
    });
  });

  grunt.registerTask('user', "create presenter username and password", function(args){
      switch (args) {
        case 'create':
          grunt.log.writeln('CREATE USER');
          var username = grunt.option('user') || grunt.log.error("NO USERNAME, grunt create:user --user=<username> --pass=<password>");
          var password = grunt.option('pass') || grunt.log.error("NO PASSWORD, grunt create:user --user=<username> --pass=<password>");
          grunt.log.writeln('USER = %s, PASS = %s', username, password);
          var userjson = {};
          userjson[username] = password;
          grunt.file.write('server/conf/userdata.json', JSON.stringify(userjson));
          grunt.log.writeln('done');
          break;
        case 'remove':
          grunt.log.writeln('REMOVE USER');
          grunt.file.delete('server/conf/userdata.json');
          break;
        default:
          grunt.log.error("Not found your command : " + args);
          break;
      }
  });

  grunt.registerTask('server', "operate server, server:start runs server, server:stop stops server, server:test test server module", function(args) {
    var options = grunt.option.flags().join(" ");
    var execCmd = '';
    switch (args) {
     case 'start': case 'stop': case 'restart':
       execCmd = 'forever ' + args + ' ' + __dirname + '/server/app.js ' + options;
       break;
     case 'test':
       grunt.option('user', 'admin');
       grunt.option('pass', 'admin');
       grunt.task.run(['user:create', 'mochaTest', 'user:remove']);
       break;
     default:
       grunt.log.error("Not found your command : " + args);
       break;
    }
    if (execCmd) {
      var exec = require('child_process').exec;
      var done = grunt.task.current.async();
      exec(execCmd, function(err, stdout, stderr) {
        grunt.log.writeln('stdout: ' + stdout);
        grunt.log.writeln('stderr: ' + stderr);
        if (stderr) {
          err = 1;
        }
        done(err);
      });
    }
  });
  grunt.registerTask('impress', "create ", function(args){
    switch (args) {
     case 'create':
       grunt.task.run(['clean', 'createImpress']);
       break;
     case 'watch':
       grunt.task.run(['clean', 'watchImpress']);
       break;
     default:
       grunt.log.error("Not found your command : " + args);
       break;
    }
  });

  var createUsage = function(message) {
    grunt.log.error(message + " grunt impress:create/impress:watch  --file=<filepath, required> --width=<width, default=1200> --height=<height, default=800> --max_column=<maxcolumn default=5> --output_dir=<output directory, default='./public'> --socket_url=<socket.io.url, default='http://localhost:3000/'>");
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
    var outputdir = grunt.option('outputdir') || "./public";
    var rm_jsdir = "rm -rf " + outputdir + "/js";
    var rm_cssdir = "rm -rf " + outputdir + "/css";
    var rm_index_html = "rm -f " + outputdir + "/index.html";
    var rm_cmd = [rm_jsdir, rm_cssdir, rm_index_html].join(" && ");
    var exec = require('child_process').exec;
    var done = grunt.task.current.async();
    exec(rm_cmd, function(err, stdout, stderr) {
      grunt.log.writeln('stdout: ' + stdout);
      grunt.log.writeln('stderr: ' + stderr);
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

  grunt.registerTask('help', function() {
    grunt.log.writeln('-- grunt impress --');

    grunt.log.writeln("grunt impress:create / create impress file");
    grunt.log.writeln("usage: grunt impress:create");
    grunt.log.writeln("  --file=<filepath, required>");
    grunt.log.writeln("  --width=<width, default=1200>");
    grunt.log.writeln("  --height=<height, default=800>");
    grunt.log.writeln("  --max_column=<maxcolumn default=5>");
    grunt.log.writeln("  --output_dir=<output directory, default="+ __dirname +"/public>");
    grunt.log.writeln("  --socket_url=<socket.io.url, default='http://localhost:3000/'>");
    grunt.log.writeln();
    grunt.log.writeln("grunt impress:watch / auto recreate impress file if changed.");
    grunt.log.writeln("usage: grunt impress:watch");
    grunt.log.writeln("  --file=<filepath, required>");
    grunt.log.writeln("  --width=<width, default=1200>");
    grunt.log.writeln("  --height=<height, default=800>");
    grunt.log.writeln("  --max_column=<maxcolumn default=5>");
    grunt.log.writeln("  --output_dir=<output directory, default="+ __dirname +"/public>");
    grunt.log.writeln("  --socket_url=<socket.io.url, default='http://localhost:3000/'>");
    grunt.log.writeln();
    grunt.log.writeln('-- grunt user --');
    grunt.log.writeln("grunt user:create / create user/password ");
    grunt.log.writeln("usage: grunt user:create");
    grunt.log.writeln("  --user=<username, required>");
    grunt.log.writeln("  --pass=<password, required>");
    grunt.log.writeln();
    grunt.log.writeln("grunt user:remove / remove user ");
    grunt.log.writeln("usage: grunt user:remove");
    grunt.log.writeln();
    grunt.log.writeln('-- grunt server --');
    grunt.log.writeln("grunt server:start / run server");
    grunt.log.writeln("usage: grunt server:start");
    grunt.log.writeln("  --path=<filepath, default=" + __dirname + "/public>");
    grunt.log.writeln("  --port=<web server port, default=3000>");
    grunt.log.writeln("  --webhook_port=<github webhook port, default=3001>");
    grunt.log.writeln("  --webhook_repo=<webhook repository, default=yosuke-furukawa/impress.io>");
    grunt.log.writeln("  --webhook_branch=<webhook branch, default=file:all> ");
    grunt.log.writeln();
    grunt.log.writeln("grunt server:stop / stop server");
    grunt.log.writeln();
    grunt.log.writeln("grunt server:test / test server");
  });
  grunt.registerTask('default', 'help');
};
