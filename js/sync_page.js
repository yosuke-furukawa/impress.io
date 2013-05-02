(function ( document, window ) {
  'use strict';
  var presenter = io.connect("http://www.yosuke-furukawa.info:3000/");
  var room = document.getElementById("title");
  var syncButton = document.getElementById("sync");
  syncButton.addEventListener('click', function(e) {
    var syncText = syncButton.innerText;
    if (syncText === 'Connect') {
      syncButton.innerText = 'Disconnect';
    } else {
      syncButton.innerText = 'Connect';
    }
    e.stopPropagation();
  }, false);
  room = room.firstElementChild.innerText;
  presenter = presenter.socket.of('/presenter');
  presenter.on('connect_failed', function(reason) {
    var listener = io.connect("http://www.yosuke-furukawa.info:3000/");
    listener = listener.socket.of('/listener');
    listener.on('connect',function() {
      listener.emit('join', room);
      listener.on('reload', function() {
        location.reload(true);
      });
      listener.on('sync', function(id) {
        if (syncButton.innerText === 'Connect') {
          impress().goto(id);
        }
      });
    });
  }).on('connect', function() {
    presenter.emit('join', room);
    presenter.on('reload', function() {
      location.reload(true);
    });
    document.addEventListener('impress:stepenter', function(el){
      if (syncButton.innerText === 'Connect') {
        presenter.emit('sync', el.target.id);
      }
    });
  });
})(document, window);
