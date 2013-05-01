(function ( document, window ) {
  'use strict';
  var presenter = io.connect("http://localhost:3000/");
  var listener = io.connect("http://localhost:3000/");
  var room = document.getElementById("title");
  room = room.firstElementChild.innerText;
  presenter.emit('join', room);
  listener.emit('join', room);
  listener.on('reload', function() {
    location.reload(true);
  });
  listener.on('sync', function(id) {
    impress().goto(id);
  });
  document.addEventListener('impress:stepenter', function(el){
    presenter.emit('sync', el.target.id);
  });
})(document, window);
