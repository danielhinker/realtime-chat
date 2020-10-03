const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongoose = require("mongoose");
bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));



mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = ({
  username: String,
  password: String
})

const User = new mongoose.model("User", userSchema)

app.get("/register", function(req, res){
  res.sendFile(__dirname + '/register.html');
});



app.post("/register", function(req, res){
  const newUser =  new User({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.sendFile(__dirname + '/index.html')
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

app.get('/login', (req, res)=>{

  res.sendFile(__dirname + '/login.html');
})

app.post('/login', (req, res)=>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        // print(found)
        console.log(foundUser)
        if (foundUser.password === password) {
          console.log("correct")
          res.redirect("/");
        }
      }
    }
  });
})

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});