const create = (collectionName, dataToSave) => {
    return new Promise((resolve, reject) => {
        const collection = require('./../models/' + collectionName)
        collection.create(dataToSave, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

module.exports = {
    create
}