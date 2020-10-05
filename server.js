require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose')
const port = process.env.PORT || 3000
const { currentUser, userJoin } = require('./helper.js');

io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(port, () => {
  console.log('listening on *:3000');
});

// app.listen(port)

let info = {
  db: process.env.db,
  username: process.env.username,
  password: process.env.password,
};

// Specifies which directory from which to serve static assets
app.use(express.static('public'))


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Sets up config for session
app.use(session({
  secret: 'xm57)7~gNQzK@.3ljNfZwT7h]A1%!4',
  resave: false,
  saveUninitialized: false
}))

// Initializes passport and sesion
app.use(passport.initialize())
app.use(passport.session())

if (process.env.NODE_ENV) {
  mongoose.connect(
    "mongodb+srv://" +
      info.username +
      ":" +
      info.password +
      "@cluster0.memc3.mongodb.net/" +
      info.db +
      "?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  
} else {
  mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 
app.get('/register', function(req, res){
  res.sendFile(__dirname + '/register.html');
});

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + "/index.html");
  } else {
    // res.sendFile(__dirname + "/index.html");
    res.redirect('/login');
  }
})



app.post('/register', function(req, res){
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect('/register')
    } else {
      passport.authenticate('local')(req, res, ()=>{
        res.redirect('/');
      })
    }
  })
  
});

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });


// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
})

app.get('/login', (req, res)=>{

  res.sendFile(__dirname + '/login.html');
})

app.post('/login', (req, res)=>{
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/');
      })
    }
  })
})

io.on('connection', (socket) => {

  const nameArray = ['Teetering Turtle', 'Crazy Cat', 'Wallowing Walrus', 'Dauntless Dino', 'Glaring Giraffe', 'Happy Hipo']
  const name = nameArray[Math.floor(Math.random() * nameArray.length)]
  // socket.on('chat message', { name } => {
  const user = userJoin(socket.id, name);
  // socket.join(user.room)
  // })
  
  // socket.on('joinRoom', ({ username, room }) => {
  //   const user = userJoin(socket.id, username, room);

  //   socket.join(user.room)

  //   socket.emit('message', 'Welcome to ChatCord!');

  //   soc
  // })

  socket.on('chat message', (msg) => {
    const user = currentUser(socket.id);
    
    io.emit('chat message', user.username + ": " + msg);
  });
  // socket.on('send-nickname', (nickname) => {
    // socket.nickname = nickname;
    // userSchema.push(socket.nickname);
  // });
  socket.on('disconnect', () => {
    // const user = userLeave(socket.id);

    // if (user) {
    //   io.to(user.room).emit(
    //     'message',
    //     formatMessage(botName, `${user.username} has left the chat`)
    //   );

    //   // Send users and room info
    //   io.to(user.room).emit('roomUsers', {
    //     room: user.room,
    //     users: getRoomUsers(user.room)
    //   });
    // }
  });
});

