function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

define("port", 3000);
define("webhook_port", 3001);
define("webhook_repo", "yosuke-furukawa/impress.io");
define("webhook_branch", "gh-pages");
define("webhook_action", "file:all");
define("publish_path", __dirname + "/../../public");
