const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const mobileRoute = require('./routes/mobile/mobileRoute');
const adminRoute = require('./routes/admin/adminRoute');
const cors = require('cors');
var morgan = require('morgan')

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(cors());
app.use(morgan('combined'))

app.use('/mobile', mobileRoute);
app.use('/admin', adminRoute);;
require('./models/adminModel')

mongoose.connect('mongodb://BuddyRoot:nOPEKO65DGMfAvfJ@cluster0-shard-00-00.ixv5w.mongodb.net:27017,cluster0-shard-00-01.ixv5w.mongodb.net:27017,cluster0-shard-00-02.ixv5w.mongodb.net:27017/Likewise?authSource=admin&replicaSet=atlas-cg4s82-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (err) {
        console.log('Error in connecting with db')
    } else {
        console.log('Successfully connected db')
    }
});

app.listen(8000, () => {
    console.log('app running on port 8000')
})

