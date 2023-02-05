
const sendErrorMessage = (res, message) => {
    res.json({
        status: "false",
        message: message,
        responseCode: 406
    });
};

const sendErrorCustomMessage = (res, message) => {
    res.json({
        status: "false",
        message: message,
        responseCode: 500
    });
};

const sendErrorData = (res, data) => {
    res.json({
        status: "false",
        errorData: data
    });
};

const sendSuccessMessage = (res, message) => {
    res.json({
        status: "true",
        message: message,
        responseCode: 200
    })
}

const sendsuccessData = (res, message, data) => {
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data
    })
}

const sendsuccessData1 = (res, message, data,status) => {
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data,
        status:status
    })
}

const sendsuccessDataMultiple = (res, message, data1, data2, created, wordCount, mode, played, patners, rank, accuracy) => {
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data1,
        countryList: data2,
        created: created,
        wordCount: wordCount,
        mode: mode,
        played: played,
        patners: patners,
        rank: rank,
        accuracy: accuracy
    })
}

const sendsuccessDataMultipleExp = (res, message, data1, data2, data3, data4, data5) => {
    data = {
        Objective: data1,
        Morerecisely: data2,
        fbFriends: data3,
        laguage: data4,
        userData: data5
    }
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data
    })
}

const sendsuccessAdditionalData = (res, message, data, totalCount, userData) => {
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data,
        totalCount,
        userData
    })
}

const sendsuccessFalse = (res, message, data) => {
    res.json({
        status: "false",
        message: message,
        responseCode: 200,
    })
}

const sendCustomMessage = (res, message) => {
    res.json({
        status: "true",
        message: message,
    })
}

const sendsuccessDataMultipleGame = (res, message, data3, data4, data5, data6, data7, data8, data9,data10,newData) => {
    data = {
        game_details: data3,
        morePrecisely: data4,
        gameCriteriaExplanations: data5,
        languageDetails: data6,
        gameCount: data7,
        receiver_details: data8,
        allmatchpercent: data10,
        newData:newData
    }
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data
    })
}

const sendsuccessDataMultipleGameOver = (res, message, data1, data2, data3, data4, data5, data6, data7, data8) => {
    data = {
        followerDetail: data1,
        TotalMessage: data2,
        TotalMatch: data3,
        LikeWisePersantege: data4,
        Unicity: data5,
        receiver_details: data6,
        coinLeft: data7,
        coinModel: data8,
    }
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data
    })
}
const sendsuccessCreateGame = (res, message, data3, data4,notificationId) => {
    data = {
        game_details: data3,
        receiver_id: data4
    }
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data,
        notificationId:notificationId
    })
}
const sendsuccessChatData = (res, message, data3, data4, data5) => {
    data = {
        chatData: data3,
        userDetails: data4,
        receiver: data5
    }
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data
    })
}
const sendsuccessDeshbord = (res, message, user, totalUser, game) => {
    data = {
        user: user,
        totalUser: totalUser,
        game: game
    }
    res.json({
        status: "true",
        message: message,
        responseCode: 200,
        data: data
    })
}
module.exports = {
    sendErrorMessage,
    sendErrorData,
    sendSuccessMessage,
    sendsuccessData,
    sendsuccessAdditionalData,
    sendsuccessFalse,
    sendCustomMessage,
    sendsuccessDataMultiple,
    sendErrorCustomMessage,
    sendsuccessDataMultipleExp,
    sendsuccessDataMultipleGame,
    sendsuccessCreateGame,
    sendsuccessDeshbord,
    sendsuccessDataMultipleGameOver,
    sendsuccessChatData,
    sendsuccessData1
}