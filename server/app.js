var http = require('http'),
    sio = require('socket.io'),
    connect = require('connect'),
    fs = require('fs'),
    qs = require('querystring'),
    userdata = require('./conf/userdata.json'),
    cookie = require('./lib/cookie.js'),
    Session = require('./lib/session.js'),
    conf = require('./conf/settings.js').argv(),
    gith = require('gith').create(conf.webhook_port);


var responsePage = function(page, res) {
  var stream = fs.createReadStream(__dirname + '/' +  page);
  stream.on('error', function(err) {
    res.writeHead(500);
    res.end('Error occured. ' + err);
  });
  stream.pipe(res);
};

var session = new Session();
var app = connect()
  .use(function (req, res, next){
    var ua = req.headers["user-agent"];
    if (ua === 'impress.io') {
      reloadAll();
    }
    next();
  })
  .use(connect.static(conf.path))
  .use(function (req, res) {
    var parsedCookie = cookie.parseCookie(req.headers.cookie);
    if (req.url === '/login') {
      var queryData = '';
      if (req.method === 'POST') {
        req.on('data', function(data) {
          queryData += data;
        });
        req.on('end', function() {
          var body = qs.parse(queryData);
          if (userdata[body.name] && userdata[body.name] === body.password) {
            var sessionId = session.store(body.name);
            var expires = new Date(Date.now() + session.expiredPeriod).toUTCString();
            res.setHeader('Set-Cookie', ["sessionId="+sessionId+";expires="+expires]);
            reloadAll();
            responsePage('success.html', res);
          } else {
            responsePage('login.html', res);
          }
        });
      } else {
        responsePage('login.html', res);
      }
    } else if (req.url === '/logout') {
      if (parsedCookie.sessionId) {
        var clearDate = new Date(1).toUTCString();
        res.setHeader('Set-Cookie', ["sessionId=;expires="+clearDate]);
        session.remove(parsedCookie.sessionId);
      }
      responsePage('login.html', res);
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  });

var server = http.createServer(app);

server.listen(conf.port);
var io = sio.listen(server);

module.exports = server;
io.of('/presenter').authorization(function (handshake, callback) {
  var parsedCookie = cookie.parseCookie(handshake.headers.cookie);
  var sessionId = parsedCookie.sessionId;
  callback(null, sessionId && !session.isExpired(sessionId));
}).on('connection', function (socket) {
  socket.on('join', function (room) {
    socket.room = room;
    socket.join(room);
  });
  socket.on('disconnect', function () {
    socket.leave(socket.room);
  });
  socket.on('sync', function (message) {
    io.of('/listener').in(socket.room).emit('sync', message);
  });
});

io.of('/listener').on('connection', function (socket) {
  socket.on('join', function (room) {
    socket.room = room;
    socket.join(room);
  });
  socket.on('disconnect', function () {
    socket.leave(socket.room);
  });
});

var reloadAll = function(){
  io.of('/presenter').emit('reload');
  io.of('/listener').emit('reload');
};

gith({
  repo: conf.webhook_repo,
  branch: conf.webhook_branch
}).on(conf.webhook_action, function( payload ) {
  reloadAll();
});
