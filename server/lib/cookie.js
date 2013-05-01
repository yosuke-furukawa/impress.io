exports.parseCookie = function(cookieStr) {
  var cookie = {};
  if (cookieStr) {
    cookieStr.split(';').forEach(function(c) {
      var parts = c.split('=');
      cookie[parts[0].trim()] = (parts[1] || '').trim();
    });
  }
  return cookie;
};
