const express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var fs = require('fs');
const find = require('./query/find');
const create = require('./query/create');
const update = require('./query/update');
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static(__dirname + '/public'));
var ObjectId = require('mongodb').ObjectId;
const notificationFunc = require('./utils/notification');
const Notification = require('./models/notificationModel.js');
const Chat = require('./models/chatModel.js');
const Game = require('./models/gameModel.js');
const Room = require('./models/roomModel.js');

require('./models/userModel');
const Notifications = require('./models/notificationModel')
mongoose.connect('mongodb://BuddyRoot:nOPEKO65DGMfAvfJ@cluster0-shard-00-00.ixv5w.mongodb.net:27017,cluster0-shard-00-01.ixv5w.mongodb.net:27017,cluster0-shard-00-02.ixv5w.mongodb.net:27017/Likewise?authSource=admin&replicaSet=atlas-cg4s82-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

server.listen(8001, function (socket) {
  console.log('running on port no: 8001')
})
var currentUsers = 0;
io.on('connection', function (socket) {
  ++currentUsers;
  io.emit('user_count', currentUsers);

  //------------------------------------message----------------------//
  socket.on('message', async (data) => {
    console.log("Message event request is=========>", data)

    if (data.sender_id && data.receiver_id && data.message && data.room_id && data.game_id && data.type) {
      var pointId = Date.now() + Math.random()
      let dataTosave = {}
      dataTosave.room_id = data.room_id,
        dataTosave.sender_id = data.sender_id,
        dataTosave.receiver_id = data.receiver_id,
        dataTosave.message = data.message,
        dataTosave.card = data.card,
        dataTosave.type = data.type,
        dataTosave.read_status = true;
      dataTosave.createdAt = new Date(),
        dataTosave.status = true,
        dataTosave.pointId = pointId
      console.log("Save data is=============>", dataTosave)
      io.to(data.room_id).emit('message', dataTosave)
      dataTosave.event_name = "message";
      console.log("Borad cast data is===========>", dataTosave)
      io.sockets.emit('broadcast', dataTosave);
      let dataToPoint = {}
      dataToPoint.room_id = data.room_id,
        dataToPoint.Image = data.Image,
        dataToPoint.sender_id = data.sender_id,
        dataToPoint.receiver_id = data.receiver_id,
        dataToPoint.game_id = data.game_id,
        dataToPoint.message = data.message,
        dataToPoint.card = data.card,
        dataToPoint.type = data.type,
        dataToPoint.read_status = true,
        dataToPoint.createdAt = new Date(),
        dataToPoint.status = true,
        dataToPoint.isMatched = data.isMatched,
        dataToPoint.all_matched = data.all_matched,
        dataToPoint.point = data.point,
        dataToPoint.isSeenBy = [{ userId: ObjectId(data.sender_id) }]
      dataToPoint.pointId = pointId,
        dataToPoint.bonus = data.bonus,
        dataToPoint.streaks = data.streaks,
        dataToPoint.score = data.score;
      dataToPoint.languageCode = data.languageCode,
        dataToPoint.messageWordCount = data.messageWordCount,
        console.log(dataToPoint)

      let chat = await create.create("chatModel", dataToPoint);

      let criteria3 = {
        room_id: data.room_id,
      }
      let dataToUpdate = {
        timeUpdate: Date.now(),
      }
      let roomData=await find.findAndUpdatePromise("roomModel", criteria3, dataToUpdate, { new: true })
      console.log("Room data is=========>",roomData)
      let checkNoti=await Notification.findOne({status:1,gameId:roomData.game_id,receiverId:data.sender_id})
      if(checkNoti){
        console.log("Noti data is========>",checkNoti)
        await Notification.findByIdAndUpdate({_id:checkNoti._id},{$set:{status:4}},{new:true})
      }
      if (data.type == "2") {
        let criteria = { _id: data.receiver_id };
        let receiverDetails = await find.findOnePromise("userModel", criteria, {}, {});
        let criteriaSend = { _id: data.sender_id };
        let senderDetails = await find.findOnePromise("userModel", criteriaSend, {}, {});

        let senderDeatil = {
          name: senderDetails.name,
          profilePic: senderDetails.profilePic,
          _id: senderDetails._id,
          type: senderDetails.type
        }

        let receiverDeatil = {
          name: receiverDetails.name,
          profilePic: receiverDetails.profilePic,
          _id: receiverDetails._id,
          type: receiverDetails.type
        }
        let searchQuery = { $and: [{ room_id: data.room_id }, { game_id: data.game_id }, { "isSeenBy.userId": { $ne: data.receiver_id } }] }
        let count = await Chat.find(searchQuery).count()
        console.log("Total count is========>", count)
        let title = "New activity on your LikeWise game"
        let message = `${senderDetails.name} added a suggestion`
        if (receiverDetails.deviceType == "Android") {
          notificationFunc.sendNotificationForAndroidChat(receiverDetails.deviceToken, title, message, "", "", data.game_id, data.room_id, count)
        }
        else {
          notificationFunc.sendNotificationForAndroidChat(receiverDetails.deviceToken, title, message, "", "", data.game_id, data.room_id, count)
        }

      }
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  });
  //------------------------------------room_join----------------------//
  socket.on('room_join', async (data) => {
    socket.join(data.room_id, async () => {
      io.to(data.room_id).emit('room_join', { room_id: data.room_id, })
    })
  });
  //-------------------------------------count---------------------------------//
  socket.on('count', async (data) => {
    console.log("Count request is========>", data)
    if (data._id) {
      let criteria1 = {
        $and: [{ "receiverId": ObjectId(data._id) }, { isSeen: false }, { status: "1" }]
      }

      // let resultTotalCount = await find.findAllAndCountPromise("notificationModel", criteria1, {}, {});
      let resultTotalCount = await Notification.find(criteria1).count()
      console.log("Notification is===============>", resultTotalCount)
      let criteria = {
        _id: ObjectId(data._id)
      }
      let project = {
        "totalPoints": 1,
        "coins": 1,
      }
      let option = { lean: true }
      let result = await find.findOnePromise("userModel", criteria, project, option);
      var myObject = {
        notificationCount: resultTotalCount,
        result: result
      }
      console.log("Not obj is=========>", myObject)
      // io.sockets.emit('broadcast', myObject);
      socket.emit('count', myObject);
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  });
  //------------------- ------------------accept --------------------//
  socket.on('accept', async (data) => {
    if (data.sender_id && data.receiver_id) {
      let dataTosave = {};
      dataTosave.sender_id = data.sender_id;
      dataTosave.receiver_id = data.receiver_id;
      dataTosave.game_id = data.game_id;
      dataTosave.read_status = true;
      dataTosave.createdAt = new Date();
      dataTosave.status = true;
      dataTosave.type = data.type;
      let criteria3 = {
        _id: data._id
      }
      let dataToUpdate = {};
      dataToUpdate.status = 2;



      find.findAndUpdatePromise("notificationModel", criteria3, dataToUpdate, { new: true })
      var objectDetails = {
        dataTosave
      }
      io.to(data.sender_id, data.receiver_id).emit('accept', objectDetails);
      io.sockets.emit('accept', objectDetails);
      // var criteria = {};
      // criteria._id = data.receiver_id;
      // var receiverDetails = await find.findOnePromise("userModel", criteria, {}, {});
      // if (receiverDetails.deviceType) {
      //   let tital = "LikeWise";
      //   let msg = "LikeWise is simply dummy text of the prining and typesettting industry";
      //   notificationFunc.sendNotificationForAndroid(receiverDetails.deviceToken, tital, msg, "", "", "", "")
      // }

    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  });
  //-------------------------------------reject --------------------//
  socket.on('reject', async (data) => {
    if (data.sender_id && data.receiver_id) {
      let dataTosave = {};
      dataTosave.sender_id = data.sender_id;
      dataTosave.receiver_id = data.receiver_id;
      dataTosave.game_id = data.game_id;
      dataTosave.read_status = true;
      dataTosave.createdAt = new Date();
      dataTosave.status = false;
      io.to(data.sender_id, data.receiver_id).emit('reject', dataTosave);
      io.sockets.emit('reject', dataTosave);

      var criteria = {};
      criteria._id = data.receiver_id;
      var receiverDetails = await find.findOnePromise("userModel", criteria, {}, {});
      let criteria3 = {
        _id: data._id
      }
      let dataToUpdate = {};
      dataToUpdate.status = 4;
      find.findAndUpdatePromise("notificationModel", criteria3, dataToUpdate, { new: true })
      await Room.findOneAndUpdate({game_id:data.game_id},{$set:{status:"4"}})

      // if (receiverDetails.deviceType) {
      //   let tital = "LikeWise";
      //   let msg = "LikeWise is simply dummy text of the prining and typesettting industry";
      //   notificationFunc.sendNotificationForAndroid(receiverDetails.deviceToken, tital, msg, "", "", "")
      // }
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  });
  //-------------------------------------Notification List----------------------//
  socket.on('Notification_list', async (data) => {
    if (data._id) {
      let notificationsList = await Notifications.aggregate([
        {
          $match: {
            "receiverId": ObjectId(data._id),
          }
        },
        {
          $lookup:
          {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "usersDetail"
          }
        },
        {
          $project: {
            'usersDetail.aboutus': 1,
            '_id': 1,
            userId: 1,
            receiverId: 1,
            gameId: 1,
            profilePic: 1,
            title: 1,
            type: 1,
            fullName: 1,
            status: 1,
            createdAt: 1
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
      ])
      objectDetailsAll = {
        list: notificationsList
      }
      socket.emit('Notification_list', objectDetailsAll);

    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  });
  //-----------------------------------card pass --------------------//
  socket.on('card_pass', async (data) => {
    if (data.sender_id && data.receiver_id, data.game_id, data.status, data.card, data.sender_by, data.receiver_by) {
      let dataTosave = {};
      dataTosave.sender_id = data.sender_id;
      dataTosave.receiver_id = data.receiver_id;
      dataTosave.game_id = data.game_id;
      dataTosave.card = data.card;
      dataTosave.room_id = data.room_id;
      dataTosave.status = true;
      dataTosave.sender_by = data.sender_by;
      dataTosave.receiver_by = data.receiver_by;
      dataTosave.SenderMessage = `Waiting for your partner to also pass`;
      dataTosave.ReceiverMessage = `Do you also want to pass?`;
      dataTosave.createdAt = new Date();
      var chat;
      if (data.receiver_by == 'true') {
        dataTosave.message = "card pass";
        let newObj={
          card_pass_user_id:null,
          card_pass_message:""
        }
        let updateObj=await Game.findByIdAndUpdate({_id:data.game_id},{$set:newObj},{new:true})
        console.log("Game save is=========>",updateObj)
        chat = await create.create("cardpassModel", dataTosave);
        io.sockets.emit('card_pass', dataTosave);
      } else {
        dataTosave.message = null;
        let newObj={
          card_pass_user_id:data.sender_id,
          card_pass_message:`Waiting for your partner to also pass`
        }
        let updateObj=await Game.findByIdAndUpdate({_id:data.game_id},{$set:newObj},{new:true})
        console.log("Game save is=========>",updateObj)
        io.to(data.sender_id, data.receiver_id).emit('card_pass', dataTosave);
        io.sockets.emit('card_pass', dataTosave);
      }
      if (data.receiver_by == 'true') {
        let criteria = {};
        var gameCreateDetails
        criteria.game_id = data.game_id;
        criteria.card = data.card;
        let userExist = await find.findOnePromise("cardCountModel", criteria, {}, {});
        if (userExist === null) {
          criteria.count = 1;
          gameCreateDetails = await create.create("cardCountModel", criteria);
        } else {
          let userExist = await find.findOnePromise("cardCountModel", criteria, {}, {})
          let criteria3 = {
            game_id: data.game_id,
            card: data.card
          }
          let dataToUpdate = {};
          dataToUpdate.count = userExist.count + 1;
          find.findAndUpdatePromise("cardCountModel", criteria3, dataToUpdate, { new: true })
        }
        for (let i = 0; i <= data.updates.length - 1; i++) {
          let criteria6 = {
            pointId: data.updates[i].pointId
          };
          let dataToUpdate = {
            score: data.updates[i].score,
            point: data.updates[i].point,
            bonus: data.updates[i].bonus,
            streaks: data.updates[i].streaks,
            isMatched: data.updates[i].isMatched,
            all_matched: data.updates[i].all_matched,


          };
          var testing = await find.findAndUpdatePromise("chatModel", criteria6, dataToUpdate, { new: true })
        }
      }
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  });
  //------------------------------------Lives pass --------------------//
  socket.on('lives_pass', async (data) => {
    if (data.sender_id && data.receiver_id, data.game_id, data.room_id, data.card, data.lives) {
      let dataTosave = {};
      dataTosave.sender_id = data.sender_id;
      dataTosave.receiver_id = data.receiver_id;
      dataTosave.game_id = data.game_id;
      dataTosave.card = data.card;
      dataTosave.room_id = data.room_id;
      dataTosave.lives = data.lives;
      io.to(data.sender_id, data.receiver_id).emit('lives_pass', dataTosave);
      io.sockets.emit('lives_pass', dataTosave);
      console.log(dataTosave)
      let result = await create.create("livesModel", dataTosave);
      console.log(result);
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  })
  //------------------------------------GameBack--------------------//
  socket.on('game_back', async (data) => {
    let dataTosave = {
      message: "update sucessfully"
    }
    io.to(data.sender_id, data.receiver_id).emit('game_back', dataTosave);
    io.sockets.emit('game_back', dataTosave);
    if (data.updates != undefined) {
      console.log(data.updates);
      console.log(data.updates.length)
      for (let i = 0; i <= data.updates.length - 1; i++) {
        let criteria6 = {
          pointId: data.updates[i].pointId
        };
        let dataToUpdate = {
          score: data.updates[i].score,
          point: data.updates[i].point,
          bonus: data.updates[i].bonus,
          streaks: data.updates[i].streaks,
          isMatched: data.updates[i].isMatched,
          all_matched: data.updates[i].all_matched
        };
        var testing = await find.findAndUpdatePromise("chatModel", criteria6, dataToUpdate, { new: true })

      }
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  })
  //------------------------------------create game------------------------//
  socket.on('create_room', async (data) => {
    if (data.sender_id && data.receiver_id, data.game_id) {
      let dataTosave = {
        sender_id: data.sender_id,
        receiver_id: data.receiver_id
      };
      let otp = Math.floor(10000000 + Math.random() * 90000000);
      let otp1 = Math.floor(10000000 + Math.random() * 90000000);
      let otp2 = Math.floor(10000000 + Math.random() * 90000000);
      let otp3 = Math.floor(10000000 + Math.random() * 90000000);
      let otp4 = Math.floor(10000000 + Math.random() * 90000000);
      let randomNumber = otp.toString()
      let randomNumber1 = otp1.toString()
      let randomNumber2 = otp2.toString()
      let randomNumber3 = otp3.toString()
      let randomNumber4 = otp4.toString()
      let room_id = randomNumber3 + randomNumber4 + data.sender_id + randomNumber1 + data.receiver_id + randomNumber2 + randomNumber;
      let roomjson = {
        "sender_id": data.sender_id,
        "receiver_id": data.receiver_id,
        "room_id": room_id,
        "game_id": data.game_id,
        "room_status": true
      }
      let result = await create.create("roomModel", roomjson);
      io.to(data.sender_id, data.receiver_id).emit('create_room', result);
      io.sockets.emit('create_room', result);
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  });
  //------------------------------------typing------------------------//
  socket.on('typing', async (data) => {
    if (data.sender_id) {
      let dataTosave = {};
      dataTosave.sender_id = data.sender_id;
      dataTosave.is_typing = data.is_typing;
      dataTosave.room_id = data.room_id;
      io.to(data.sender_id, data.room_id).emit('typing', dataTosave);
      io.sockets.emit('typing', dataTosave);
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  })
  // when the client emits 'stop typing', we broadcast it to others
  socket.on('typing_in', async (data) => {
    if (data.sender_id) {
      let dataTosave = {};
      dataTosave.sender_id = data.sender_id;
      dataTosave.room_id = data.room_id;
      io.to(data.room_id, data.sender_id).emit('typing_in', dataTosave)
      dataTosave.event_name = "typing_in";
      io.sockets.emit('broadcast', dataTosave);
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  })
  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop_typing', async (data) => {
    if (data.sender_id) {
      let dataTosave = {};
      dataTosave.sender_id = data.sender_id;
      dataTosave.room_id = data.room_id;
      io.to(data.room_id, data.sender_id).emit('stop_typing', dataTosave)
      dataTosave.event_name = "stop_typing";
      io.sockets.emit('broadcast', dataTosave);
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  })
  // when the client emits 'stop typing', we broadcast it to others
  socket.on('time_start', async (data) => {
    console.log(data.sender_id);
    if (data.sender_id) {
      let dataTosave = {};
      dataTosave.sender_id = data.sender_id;
      dataTosave.room_id = data.room_id;
      dataTosave.receiver_id = data.receiver_id;
      io.to(data.receiver_id, data.sender_id).emit('time_start', dataTosave)
      io.sockets.emit('time_start', dataTosave);
    } else {
      socket.emit('time_start', { msg: 'Please send correct data ' });
    }
  })
  socket.on('coin_dedicated', async (data) => {
    console.log("Coin detected is=========>", data);
    if (data._id) {
      let dataTosave = {};
      dataTosave._id = data._id;
      let userExist = await find.findOnePromise("userModel", dataTosave, {}, {});
      if (!userExist) {
        socket.emit('coin_dedicated', { msg: 'UserId not exists' });
      } else {
        let dataTosave1 = {};
        dataTosave1.user_id = data._id;
        dataTosave1.room_id = data.game_id;
        let userExist1 = await find.findOnePromise("checkCoinModel", dataTosave1, {}, {});
        let userData = await find.findAllPromise("coinModel", {}, {}, {});
        let myCoins = userExist.coins - userData[0].speedToRevealChat;
        if (myCoins < 0) {
          console.log("Error is=======>")
          socket.emit('coin_dedicated', { msg: 'Insufficient Coins' });
          return
        }
        if (userExist1 === null) {
          if (userExist.coins > 0) {
            let dataToUpdate = {};
            let setData = {};
            let results = await find.findAllPromise("coinModel", {}, {}, {});
            setData.coins = userExist.coins - results[0].speedToRevealChat;
            dataToUpdate.coins = userExist.coins - results[0].speedToRevealChat;
            dataToUpdate.senderId = data._id;
            let result1 = await find.findAndUpdatePromise("userModel", dataTosave, setData, {})
            io.to(data._id).emit('coin_dedicated', dataToUpdate);
            io.sockets.emit('coin_dedicated', dataToUpdate);
            let dataToPoint = {};
            dataToPoint.user_id = data._id;
            dataToPoint.room_id = data.game_id;
            let chat = await create.create("checkCoinModel", dataToPoint);
          } else {
            socket.emit('coin_dedicated', { msg: 'Insufficient Coins' });
          }
        } else {
          let dataToUpdate = {};
          dataToUpdate.coins = userExist.coins;
          dataToUpdate.senderId = data._id;
          io.to(data._id).emit('coin_dedicated', dataToUpdate);
          io.sockets.emit('coin_dedicated', dataToUpdate);
        }
      }
    } else {
      socket.emit('message', { msg: 'Please send correct data ' });
    }
  })
  //--------------------------disconnect-----------------------------------//
  socket.on('disconnect', () => {
    console.log('A user has disconnected');
    --currentUsers;
    io.emit('user_count', currentUsers);
  });
})
