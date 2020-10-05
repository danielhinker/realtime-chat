// const chatMessage = $('#messages')
$(function () {
    var socket = io();
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', (msg)=>{
        // for (i = 0; i < 40; i++) {
      const $li = $('#messages').append($('<li>').text(socket.id.slice(0, 5) + ": " + msg));

    //   $("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight")}, 1000);
    $('html, body').animate({scrollTop:$(document).height() + $("li").last().height()}, 800);
    // }
    });
  });

 