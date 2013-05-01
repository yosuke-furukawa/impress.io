var Session = require("../../lib/session.js");
var assert = require("assert");


describe('session', function(){
  describe('#store', function(){
    it('should session#store return 10 digit numbers', function(){
      var session = new Session();
      assert.ok(session.store("test"));
    });
    it('should session#store return null if set null', function(){
      var session = new Session();
      assert.equal(session.store(null), null);
    });
  });
  describe('#isExpired', function(){
    it('should session#isExpired return false', function(){
      var session = new Session();
      var sessionId = session.store("test");
      assert.equal(session.isExpired(sessionId), false);
    });
    it('should session#isExpired return true', function(){
      var session = new Session({expired:-1}); //seession is always expired.
      var sessionId = session.store("test");
      assert.equal(session.isExpired(sessionId), true);
    });
    it('should session#isExpired return true if session is empty', function(){
      var session = new Session();
      var sessionId = 121345;
      assert.equal(session.isExpired(sessionId), true);
    });
  });
  describe('#remove', function(){
    it('should session#remove remove session', function(){
      var session = new Session();
      var sessionId = session.store("test");
      assert.equal(session.isExpired(sessionId), false);
      session.remove(sessionId);
      assert.equal(session.isExpired(sessionId), true);
    });
  });
  describe('#getUserName', function(){
    it('should session#getUserName get username', function(){
      var session = new Session();
      var sessionId = session.store("test");
      assert.equal(session.getUserName(sessionId), "test");
    });
  });
});
