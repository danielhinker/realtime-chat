// const chatMessage = $('#messages')
const nameArray = ['Teetering Turtle', 'Crazy Cat', 'Wallowing Walrus', 'Dauntless Dino', 'Glaring Giraffe', 'Happy Hipo']
const name = nameArray[Math.floor(Math.random() * nameArray.length)]
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
      const $li = $('#messages').append($('<li>').text(name + ": " + msg));

    //   $("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight")}, 1000);
    $('html, body').animate({scrollTop:$(document).height() + $("li").last().height()}, 800);
    // }
    });
  });

 