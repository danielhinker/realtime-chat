// const userList = $('#users')

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
      const $li = $('#messages').append($('<li>').text(msg));

    //   $("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight")}, 1000);
    $('html, body').animate({scrollTop:$(document).height() + $("li").last().height()}, 800);
    // }
    });
  });

//  function createUserList(users) {
//      userList.innerHTML = '';
//      users.forEach(user=>{
//          const li = document.createElement('li');
//          li.innerText = user.username;
//          userList.appendChild(li);
//      })
//  }