const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
var rooms_table = []
var connected = 0
var chat = []
var user_chat = []
var users =  []

// our localhost port
const port = 4001

const app = express()

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)
var username = ''

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('a user connected');
  socket.on('/nik', (nickname) => {
    var search = users.find(function(value){
      return value.name === nickname
    })
    if(search === undefined){
      users.push({'name': nickname})
      console.log('création d\'user done')
      console.log('voici le nom : ' + nickname)
      io.sockets.emit('show_name', nickname)
    } else {
      io.sockets.emit('show_name',false)
    }
  })
  socket.on('/create', (room_name) => {
    var search = rooms_table.find(function(value){
      return value === room_name
    })
    if(search === undefined){
      rooms_table.push(room_name)
      console.log(room_name)
      console.log('création de room done')
      io.sockets.emit('new_room','création de room reussie')
      io.sockets.emit('room_verif',true)
    } else{
        io.sockets.emit('room_verif',false)
      }
  })
  socket.on('/list', (name) => {
    io.sockets.emit('list_show',rooms_table)
  })
  socket.on('/join', (room_name, username) => {
    console.log('recherche de la room...')
    console.log(rooms_table)
    var search = rooms_table.find(function(value){
      return value === room_name
    })
    if(search === room_name)
    {
      var trouve = user_chat.find(function(value){
        return value.room === room_name && value.user === username
      })
      if (trouve === undefined) {
        chat.push({room: room_name , user: 'notification',message: username + ' vient de se connecter à la room.'})
        user_chat.push({room: room_name, user: username})
      }
      console.log('Bienvenue dans la room ' + room_name)
      socket.join(room_name);
      socket.emit('connectToRoom', room_name)
    }
  })
  socket.on('/message', function(user, msg, room){
    chat.push({room: room , user: user, message: msg})
    console.log(chat)
    socket.emit('get message', chat);
  });
  socket.on('get_chat', function (test){
    socket.emit('tab_chat', chat);
  })
  socket.on('/part', function(user, room){
    socket.leave(room);
    chat.push({room: room , user: 'notification', message: user + ' a quitté la room.'})
    console.log(chat)
    for(var i = user_chat.length - 1; i >= 0; i--) {
        if((user_chat[i].room === room) && (user_chat[i].user === user)){
           user_chat.splice(i, 1);
        }
    }
  })
  socket.on('/users', function(data){
    socket.emit('/users_list', user_chat)
  })
  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))