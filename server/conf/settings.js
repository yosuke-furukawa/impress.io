module.exports.argv = function() {
  return require('optimist')
    .default("port", 3000)
    .default("webhook_port", 3001)
    .default("webhook_repo", "yosuke-furukawa/impress.io")
    .default("webhook_branch", "gh-pages")
    .default("webhook_action", "file:all")
    .default("path", __dirname + "/../../public")
    .argv;
};
