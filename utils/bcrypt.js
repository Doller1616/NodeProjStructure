const bcrypt = require('bcryptjs');

const bcryptGenerate = (password) =>{
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) reject(err)
                else resolve(hash)
            });
        });
    })    
}

const bcryptCompare = (newpwd, existpwd) =>{
    return new Promise((resolve, reject) => {
        bcrypt.compare(newpwd, existpwd, (err, hash) => {
            if(err) reject(err)
            else resolve(hash)
        });
        
    })    
}

module.exports = {
    bcryptGenerate,
    bcryptCompare
}