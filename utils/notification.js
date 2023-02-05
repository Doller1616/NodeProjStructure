var FCM = require('fcm-node');
const request = require('request');
var serverKey = 'AAAAGko28vM:APA91bEm1w--G5ph_iJ6Eyq2GJukniejNRalfH5CtcTRG1oJnTaVYjkbl2FHuy8TNm86YEfZELe1CBJlkZRoHvRVd3woKkPl8XmtwC64mjSA-kPrK9xEP2rNpz_8wWrAtRWHBzxBhuQ9';
var fcm = new FCM(serverKey);

var apn = require("apn"),
    options, connection, notification;
const sendNotificationForAndroid = (deviceToken, title, msg, sendUserDetails, receiverUserInformation, gameCreateDetails, NotificationId) => {
    var message = {
        to: deviceToken,
        notification: {
            "body": msg,
            "title": title,
            type: "type",
            sound: 'default',
        },
        data: {
            "body": msg,
            "title": title,
            message: msg,
            type: "type",
            sound: 'default',
            NotificationId: NotificationId,
            sendUserDetails: sendUserDetails,
            receiverUserInformation: receiverUserInformation,
            gameCreateDetails: gameCreateDetails,
        },
    };
    fcm.send(message, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(" ==========================chat notification sent successfully > ", response)
        }
    });
}

const sendNotificationForAndroidChat = (deviceToken, title, msg, sendUserDetails, receiverUserInformation, gameCreateDetails, roomId,msgCount) => {
    var message = {
        to: deviceToken,
        notification: {
            "body": msg,
            "title": title,
            type: "type",
            sound: 'default',
        },
        data: {
            "body": msg,
            "title": title,
            message: msg,
            type: "type",
            sound: 'default',
            roomId: roomId,
            sendUserDetails: sendUserDetails,
            receiverUserInformation: receiverUserInformation,
            gameCreateDetails: gameCreateDetails,
            msgCount:msgCount
        },
    };
    fcm.send(message, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(" ==========================chat notification sent successfully > ", response)
        }
    });
}

const sendNotificationForIos = (deviceToken, title, msg, type, roomid, receiver, sender, fullName, desc) => {
    console.log('-------------chat sendNotificationForIos')
    var options = {
        "cert": "PushDevRealEstate.pem",
        "key": "PushDevRealEstate.pem",
        "production": false
    };
    var apnProvider = new apn.Provider(options);
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 1;
    note.sound = msg;
    note.alert = {
        title: title,
        body: msg
    }
    note.payload = {
        title: title,
        msg: msg,
        type: type,
        roomid,
        receiver,
        sender,
        fullName,
        desc
    };
    note.topic = "RealEstate.app";
    apnProvider.send(note, deviceToken).then((result) => {
        console.log("Ios notication send successfully is for chat=============>", result);
    })
        .catch((e) => {
            console.log("err in sending ios notification is==================>", e);
        })

};

const sendNotificationForIosChat = (deviceToken, title, msg, type, sender, receiver, game, roomId, msgCount) => {
    console.log('-------------chat sendNotificationForIos')
    var options = {
        "cert": "PushDevRealEstate.pem",
        "key": "PushDevRealEstate.pem",
        "production": false
    };
    var apnProvider = new apn.Provider(options);
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 1;
    note.sound = msg;
    note.alert = {
        title: title,
        body: msg
    }
    note.payload = {
        title: title,
        msg: msg,
        type: type,
        sender,
        receiver,
        roomId,
        game,
        msgCount
    };
    note.topic = "RealEstate.app";
    apnProvider.send(note, deviceToken).then((result) => {
        console.log("Ios notication send successfully is for chat=============>", result);
    })
        .catch((e) => {
            console.log("err in sending ios notification is==================>", e);
        })

};
const webNotification = () => {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AIzaSyB8waf8ZfHWsX5R3xZZptvaYzsCWaUa3KY'
        },
        json: {
            "notification": {
                "title": "Hello World",
                "body": "This is Message from Admin",
                "icon": "https://mobulous.app/real/assets/img/Real-Estate-logo.png",
                "click_action": "http://18.191.90.186/properties/properties-details/5de247e9af62581121d9b059"
            },
            "to": "fjrmdZ1oIGfhULdERjVCDu:APA91bHWfXUymZXsTw5HBu2UIJ9z7mMgCV9FhhVCXEn0am0z1xKrb19K3xbyR8WbyVKhzWyNaqiSat02v_SFaQGG1H4UdiBL9qvl2ty9QzJavIwI_DZ1irGsuGCScyp6UaP2UU3L6f1J"
        },
    };
    request.post('https://fcm.googleapis.com/fcm/send', options, function (err, response) {
        if (err) {
            res.send(err)
        } else {
            res.send(response.body);
        }
    });
}

module.exports = {
    sendNotificationForAndroid,
    sendNotificationForIos,
    webNotification,
    sendNotificationForAndroidChat,
    sendNotificationForIosChat

}














// {
//     "mode":"1",
//     "languageCode":"en",
//     "customInstructions":"Helo",
//     "morePrecisely":"Hello how are you",
//     "objective":"testin",
//     "socialId":"123",
//     "_id":"5e724c4a1730e808820f4ff3"
//     }