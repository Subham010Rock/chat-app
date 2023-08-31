const express = require('express');
const path = require('path')
const http = require('http')

const socketio = require('socket.io')
const {generateLocationMessage,generateMessage} = require('./utils/message.js')
const {storeUser,getUser} = require('./utils/userData.js')

const app = express();
const server = http.createServer(app)
const io =socketio(server)

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath));

let count = 0;
io.on('connection',(socket)=>{
    console.log('client connected')

    // io.emit('message',generateMessage('Welcome!'))


    socket.on('location',(location,callback)=>{


        io.emit('location',generateLocationMessage(location))
        callback();
    })
    socket.on('sendMessage',(data,callback)=>{
        const user = getUser(socket.id);
        console.log(user)
        io.to(user.room).emit('message',generateMessage(data,user.userName));
        callback();
    })
    socket.on('join',({username,room})=>{
        socket.join(room)
        storeUser({_id:socket.id,username,room})
        socket.emit("welcomeMessage",generateMessage(`Welcome ${username} in room ${room}`))
        
        //socket.broadcast.to(room).emit("message",generateMessage(`Welcome ${username} in romm ${room}`));
    })

})


// app.get('/',(req,res)=>{
//     res.sendFile("index.html")
// })



server.listen(3000,()=>{
    console.log("listening on http://localhost:3000")
})