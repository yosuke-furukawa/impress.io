// Sessionオブジェクトをモジュール化する。
module.exports = Session;

function Session(option) {
  option = option || {};
  // セッション保持時間（ミリ秒単位で指定、デフォルトは2時間）
  this.expiredPeriod = option.expired || 2 * 60 * 60 * 1000;
  // ユーザー名とセッションIDの対応表
  var userNameMap = {};
  // セッションタイムアウト時間とセッションIDの対応表
  var expiredMap = {};

  var self = this;

  // セッションにユーザー名をストアする。
  this.store = function(username) {
    if (!username) return null;
    //乱数を作成し、セッションIDとする。
    var sessionId = Math.floor(Math.random()*1000000);
    var expiredTime = Date.now() + self.expiredPeriod;
    userNameMap[sessionId] = username;
    expiredMap[sessionId] = expiredTime;
    return sessionId;
  };

  // 指定されたセッションを削除する。
  this.remove = function(sessionId) {
    if (!sessionId) return;
    delete userNameMap[sessionId];
    delete expiredMap[sessionId];
  };

  // セッション保持期間切れかどうかを確認する。
  this.isExpired = function(sessionId) {
    var result = userNameMap[sessionId] && Date.now() > expiredMap[sessionId];
    result = result || result === undefined;
    return result;
  };

  // セッション保持期間を更新する。
  this.updateExpiredTime = function(sessionId) {
    if (!sessionId) return;
    var expiredTime = Date.now() + self.expiredPeriod;
    expiredMap[sessionId] = expiredTime;
  };

  // セッションに登録しているユーザー名を取得する。
  this.getUserName = function(sessionId) {
    return userNameMap[sessionId];
  };
}

