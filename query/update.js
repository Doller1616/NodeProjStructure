const updateMany = (collectionName, criteria, dataToUpdate, option) => {
    return new Promise ((resolve, reject) => {
        const collName = require('../models/' + collectionName);
        collName.updateMany(criteria, dataToUpdate, option).exec((err, info) => {
            if(err) reject(err);
            else resolve(info)
        })
    })
}
const updateOne = (collectionName, criteria) => {
    return new Promise ((resolve, reject) => {
        const collName = require('../models/' + collectionName);
        collName.update(criteria).exec((err, info) => {
            if(err) reject(err);
            else resolve(info)
        })
    })
}


module.exports = { 
    updateMany,
    updateOne
}