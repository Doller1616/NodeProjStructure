const express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var fs = require('fs');
const find = require('./query/find');
const create = require('./query/create');
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static(__dirname + '/public'));
var ObjectId = require('mongodb').ObjectId;

// const notificationFunc = require('./utils/notification');
// const notificationModel = require('./models/notificationModel')



mongoose.connect('mongodb://BuddyRoot:nOPEKO65DGMfAvfJ@cluster0-shard-00-00.ixv5w.mongodb.net:27017,cluster0-shard-00-01.ixv5w.mongodb.net:27017,cluster0-shard-00-02.ixv5w.mongodb.net:27017/Likewise?authSource=admin&replicaSet=atlas-cg4s82-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

server.listen(3008, function (socket) {
  console.log('running on port no: 3008')
})
console.log('Hello')
io.on('connection', function (socket) {

  console.log('an user connected', socket.id)
  socket.on('message', async (data) => {

    console.log(data)
    console.log(data.sender_id)
    if (data.sender_id && data.receiver_id && data.message && data.room_id && data.game_id) {
      let roomCheckCriteria = { room_id: data.room_id }
      let roomCheck = find.findOnePromise("roomModel", roomCheckCriteria, {}, {})
      if (!roomCheck) {
        socket.emit({ response_code: 400, message: 'Please Enter Valid Room Id' })
      }
      console.log('try')
      let dataTosave = {}
      console.log('try saving data')
      dataTosave.room_id = data.room_id
      dataTosave.sender_id = data.sender_id
      dataTosave.receiver_id = data.receiver_id
      dataTosave.message = data.message
      dataTosave.read_status = true
      dataTosave.attachment_type = data.attachment_type
      dataTosave.createdAt = new Date()
      dataTosave.status = true
      io.to(data.room_id).emit('message', dataTosave)
      await find.findAndUpdatePromise("roomModel", { room_id: data.room_id }, { delete_by: [] }, {})
      io.sockets.emit('broadcast', dataTosave);
      let chat = await create.create("chatModel", dataTosave)
      console.log('savedData', chat)
      let criteria = {
        room_id: data.room_id
      }
      let dataToUpdate = {}
      dataToUpdate.lastmessage = data.message
      find.findAndUpdatePromise("roomModel", criteria, dataToUpdate, {})
      /************************** send Notification starts*****************************/
      let userSender = await find.findOnePromise("userModel", { _id: data.sender_id }, {}, {})
      let userReceiver = await find.findOnePromise("userModel", { _id: data.receiver_id }, {}, {})
      console.log(userReceiver)
      if (userReceiver.deviceType == 'android' && userReceiver.notification == true) {
        console.log('android noti')
        notificationFunc.sendNotificationForAndroid(userReceiver.deviceToken, userSender.fullName + ' messaged you', data.message, "chat", data.room_id, data.receiver_id, data.sender_id, userSender.fullName, data.description, data.title)
      }
      if (userReceiver.deviceType == 'iOS' && userReceiver.notification == true) {
        notificationFunc.sendNotificationForIos(userReceiver.deviceToken, userSender.fullName + ' messaged you', data.message, "chat", data.room_id, data.receiver_id, data.sender_id, userSender.fullName, data.description, data.title)
      }
      /************************** send Notification starts*****************************/

    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  })

  socket.on('room_join', async (data) => {
    console.log('room join', data.room_id);
    socket.join(data.room_id, async () => {
      io.to(data.room_id).emit('room_join', { room_id: data.room_id, })
    })
  })
})