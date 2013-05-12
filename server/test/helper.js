var sio = require('socket.io');

var origin_handshakeData = sio.Manager.prototype.handshakeData;
var header;
var self = this;
module.exports.setHeader = function(header) {
  self.header = header;
};

sio.Manager.prototype.handshakeData = function() {
  var args = arguments;
  Object.keys(self.header || {}).forEach(function(key) {
    args[0].request.headers[key] = self.header[key];
  });
  return origin_handshakeData.apply(this, args);
};
