const cloudinary = require('cloudinary');
const fs = require('fs');
var AWS = require('aws-sdk');


// cloudinary.config({
//     cloud_name: "dlopkjzfr",
//     api_key: "889381355859569",
//     api_secret: "TRkFYEnaBIDSfmuvF2sn3sQikVk"
// });



AWS.config = {
    "accessKeyId": 'AKIAVEKBYDWWCN42ULP2',
    "secretAccessKey": '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',
    "region": 'us-east-2',
};
const s3 = new AWS.S3({ region: 'ap-south-1' })
const imageUpload = (file, path) => {
    console.log("file",file)
    return new Promise((resolve, reject) => {
        var tmp_path = file.path;
        image = fs.createReadStream(tmp_path);
        imageName = path + new Date().getTime() + "-" + file.name.split(' ').join('_');
        const params = {
            Bucket: 'socialmediadev',
            Key: imageName,
            ACL: 'public-read',
            Body: image
        };
        s3.putObject(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                let url = "https://s3.us-east-2.amazonaws.com/socialmediadev/" + imageName;
                console.log("url",url)
                resolve(url);
            }
        })
    })
}


// const imageUpload = (imageFile) => {
//     return new Promise((resolve, reject) => {
//         cloudinary.v2.uploader.upload(imageFile.path, (error, result) => {
//             if (error) {
//                 console.log(error)
//                 reject(error);
//             } else {
//                 resolve(result);
//             }
//         })
//     })
// }

const videoUpload = (videoFile) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_large(videoFile.path, (error, result) => {
            if (error) {
                console.log(error)
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}

module.exports = {
    imageUpload,
    videoUpload
}