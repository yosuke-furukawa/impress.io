var app = require("../app.js");
var assert = require("assert");
var exec = require('child_process').exec;
var fs = require('fs');
var request = require('supertest');
var cookieParser = require('../lib/cookie');
var ioc = require('socket.io-client');
var helper = require('./helper.js');

describe('server', function(){
  before(function(done){
    exec("cd " + __dirname + "/../.. && grunt impress:create --file=README.md", function(err, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
      done(err);
    });
  });
  after(function(done){
    exec("cd " + __dirname + "/../.. && grunt clean", function(err, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
      done(err);
    });
  });
  describe('#server html and routing test', function(){
    it ('should return index.html', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function (err, res) {
          var output = "" + fs.readFileSync(__dirname + '/../../public/index.html');
          assert.equal(res.text, output);
          done();
        });
    });
    it ('should return login.html', function(done) {
      request(app)
        .get('/login')
        .expect(200)
        .end(function (err, res) {
          var output = "" + fs.readFileSync(__dirname + '/../login.html');
          assert.equal(res.text, output);
          done();
        });
    });
    it ('should return success.html', function(done) {
      request(app)
        .post('/login')
        .send("name=admin&password=admin")
        .expect(200)
        .end(function (err, res) {
          var output = "" + fs.readFileSync(__dirname + '/../success.html');
          assert.equal(res.text, output);
          var origin_cookie = res.header["set-cookie"][0];
          var cookie = cookieParser.parseCookie(origin_cookie);
          assert.ok(cookie.sessionId);
          done();
        });
    });
    it ('logout, should return login.html', function(done) {
      request(app)
        .get('/logout')
        .expect(200)
        .end(function (err, res) {
          var output = "" + fs.readFileSync(__dirname + '/../login.html');
          assert.equal(res.text, output);
          console.log(res.header);
          var origin_cookie = res.header["set-cookie"];
          // Removed cookie
          assert.equal(undefined, origin_cookie);
          done();
        });
    });
  });
  describe('connect socket.io and communicate each others', function(){
    beforeEach(function(done){
      console.log("before");
      request(app)
        .post('/login')
        .send("name=admin&password=admin")
        .end(function (err, res) {
          var origin_cookie = res.header["set-cookie"][0];
          var header = {cookie: origin_cookie};
          helper.setHeader(header);
          done();
        });
    });
    afterEach(function(done) {
      console.log("after");
      request(app)
        .get('/logout')
        .end(function (err, res) {
          // Removed cookie
          helper.setHeader({cookie: "sessionId=0;expires=0;"});
          done();
        });
    });
    it ('connect socket.io and enable listener', function(done) {
      var opt = {'force new connection': true};
      var listener = ioc.connect('http://localhost:3000/listener', opt);
      listener.on('connect', function() {
        listener.emit('join', "test");
        listener.on('sync', function(id) {
          assert.equal(id, "test");
          done();
        });
        var presenter = ioc.connect('http://localhost:3000/presenter', opt);
        presenter.on('connect', function() {
          presenter.emit('join', "test");
          presenter.emit('sync', "test");
        });
      });

    });
    it ('connect socket.io but can not send different event', function(done) {
      var opt = {'force new connection': true};
      var listener1 = ioc.connect('http://localhost:3000/listener', opt);
      var listener2 = ioc.connect('http://localhost:3000/listener', opt);
      listener1.on('connect', function() {
        listener1.emit('join', "test1");
        listener1.on('sync', function(id) {
          done("should not reach here.");
        });
      });
      listener2.on('connect', function() {
        listener2.emit('join', "test2");
        listener2.on('sync', function(id) {
          assert.equal(id, "test");
          done();
        });
        var presenter = ioc.connect('http://localhost:3000/presenter', opt);
        presenter.on('connect', function() {
          presenter.emit('join', "test2");
          presenter.emit('sync', "test");
        });
      });

    });
  });
  describe('not before login', function(){
    it ('cannot connect presenter nsp without login', function(done) {
      var opt = {'force new connection': true};
      var presenter = ioc.connect('http://localhost:3000', opt);
      presenter = presenter.socket.of('/presenter');
      presenter.on('connect_failed', function() {
        done();
      });
      presenter.on('connect', function(){
        done("should not reach here");
      });
    });
    it ('send reload event when login', function(done) {
      var opt = {'force new connection': true};
      var listener = ioc.connect('http://localhost:3000/listener', opt);
      listener.on('connect', function() {
        listener.on('reload', function() {
          done();
        });
        request(app)
          .post('/login')
          .send("name=admin&password=admin")
          .end(function (err, res) {
          });
      });
    });
  });
});
