var http = require('http'),
    sio = require('socket.io'),
    fs = require('fs'),
    qs = require('querystring'),
    userdata = require('./conf/userdata.json'),
    cookie = require('./lib/cookie.js'),
    Session = require('./lib/session.js'),
    conf = require('./conf/settings.json'),
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

var app = http.createServer(function (req, res) {
  var parsedCookie = cookie.parseCookie(req.headers.cookie);
  if (req.url === '/') {
    var ua = req.headers["user-agent"];
    if (ua === 'impress.io') {
      reloadAll();
    }
    responsePage('login.html', res);
  } else if (req.url === '/login') {
    var queryData = '';
    if (req.method === 'POST') {
      req.on('data', function(data) {
        queryData += data;
      });
      req.on('end', function() {
        var body = qs.parse(queryData);
        if (userdata[body.name] === body.password) {
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

app.listen(conf.port);
var io = sio.listen(app);

io.sockets.on('connection', function (socket) {
  socket.on('join', function (room) {
    socket.room = room;
    socket.join(room);
  });
  socket.on('sync', function (message) {
    var parsedCookie = cookie.parseCookie(socket.handshake.headers.cookie);
    var sessionId = parsedCookie.sessionId;
    if (!sessionId || session.isExpired(sessionId)) {
      console.log("unauthorized ignore");
    } else {
      socket.broadcast.to(socket.room).emit('sync', message);
    }
  });
  socket.on('disconnect', function () {
    socket.leave(socket.room);
  });
});

var reloadAll = function(){
  io.sockets.emit('reload');
};

gith({
  repo: conf.webhook_repo,
  branch: conf.webhook_branch
}).on(conf.webhook_action, function( payload ) {
  reloadAll();
});
