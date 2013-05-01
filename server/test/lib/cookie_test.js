var cookie = require("../../lib/cookie.js");
var assert = require("assert");


describe('cookie', function(){
  describe('#parseCookie', function(){
    it('cookie#parseCookie, xxxx=yyyy;xxxxx=1 => {xxxx:yyyy, xxxxxx:1}', function(){
      var cookieStr = "xxxx=yyyy; digit=1";
      var parsedCookie = cookie.parseCookie(cookieStr);
      assert.deepEqual(parsedCookie, {"xxxx":"yyyy", "digit":"1"});
    });
  });
});
