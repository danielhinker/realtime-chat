require('dotenv').config()
const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

bodyParser = require('body-parser');
// const encrypt = require("mongoose-encryption");
const md5 = require('md5');
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));



mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

// Previously used with Mongoose Encryption
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']})

const User = new mongoose.model("User", userSchema)
 
app.get("/register", function(req, res){
  res.sendFile(__dirname + '/register.html');
});



app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const newUser =  new User({
      username: req.body.username,
      password: hash
      // Previously used with md5 hash
      // password: md5(req.body.password)
    });
    newUser.save(function(err){
      if (err) {
        console.log(err);
      } else {
        res.sendFile(__dirname + '/index.html')
      }
    });
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
  const password = req.body.password
  // Previously used with md5
  // const password = md5(req.body.password);

  User.findOne({username: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        
        bcrypt.compare(password, foundUser.password, (err, result)=>{
          if (result == true) {
            res.redirect("/");
          }
        })
        
      }
    }
  });
})

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});