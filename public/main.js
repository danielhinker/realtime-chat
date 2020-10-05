$(function () {
    var socket = io();
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', (msg)=>{
      $('#messages').append($('<li>').text(socket.id.slice(0, 5) + ": " + msg));
    });
  });