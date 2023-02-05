

const findAllPromise = (collectionName, criteria, project, options) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName)
        collection.find(criteria, project, options).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
}
const findOneAndDeletePromise = (collectionName, criteria) => {
    return new Promise((resolve, reject) => {
        const collection = require('../model/' + collectionName);
        collection.findOneAndRemove(criteria).exec((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}
const findOnePromise = (collectionName, criteria, project, options) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName)
        collection.findOne(criteria, project, options).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
}

const findByIdAndUpdatePromise = (collectionName, criteria, project, option) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName)
        collection.findByIdAndUpdate(criteria, project, option).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
};

const getOnePopulatePromise = (collectionName, criteria, project, options, populateArray) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName);
        collection.findOne(criteria, project, options).populate(populateArray).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
};

const getAllPopulatePromise = (collectionName, criteria, project, options, populateArray) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName);
        collection.find(criteria, project, options).populate(populateArray).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
};

const findAndUpdatePromise = (collectionName, criteria, dataToUpdate, option, populateArray) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName);
        collection.findOneAndUpdate(criteria, dataToUpdate, option).populate(populateArray).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
};

const findAndUpdateAllPromise = (collectionName, criteria, dataToUpdate, option, populateArray) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName);
        collection.updateMany(criteria, dataToUpdate, option).populate(populateArray).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
};

const findAndRemovePromise = (collectionName, criteria, option) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName);
        collection.findOneAndRemove(criteria, option).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
};
const findByIdAndRemove = (collectionName, criteria, option) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName);
        collection.findByIdAndRemove(criteria, option).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
};


const findAndRemoveManyPromise = (collectionName, criteria, option) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName);
        collection.deleteMany(criteria, option).exec((err, info) => {
            if (err) reject(err);
            else resolve(info);
        });
    })
};

const findWithSkipLimit = (collectionName, criteria, project, options, skipDoc, limitDoc, populateArray) => {
    return new Promise((resolve, reject) => {
        const collName = require('../models/' + collectionName);
        collName.find(criteria, project, options).skip(skipDoc).limit(limitDoc).populate(populateArray).exec((err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}
const findAllAndCountPromise = (collectionName, criteria) => {
    return new Promise((resolve, reject) => {
        const collection = require('../models/' + collectionName);
        collection.countDocuments(criteria).exec((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    })
}
const findCountPromise = (collectionName, criteria) => {
    return new Promise((resolve, reject) => {
        const collName = require('../models/' + collectionName);
        collName.countDocuments(criteria, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })

}
const findLastInsertId = (collectionName, criteria) => {
    return new Promise((resolve, reject) => {
        const collName = require('../models/' + collectionName);
        collName.find(criteria).sort({ _id: -1 }).limit(1).exec((err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })

}

const pagination = (collectionName, criteria, option) => {
    return new Promise((resolve, reject) => {
        const collName = require('../models/' + collectionName);
        collName.paginate(criteria, option, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

const findSortBy = (collectionName, criteria, option, limit) => {
    return new Promise((resolve, reject) => {
        const collName = require('../models/' + collectionName);
        collName.find(criteria).sort(option).limit(limit).exec((err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

module.exports = {
    findAllPromise,
    findOnePromise,
    findByIdAndUpdatePromise,
    getOnePopulatePromise,
    getAllPopulatePromise,
    findAndUpdatePromise,
    findAndUpdateAllPromise,
    findAndRemovePromise,
    findAndRemoveManyPromise,
    findByIdAndRemove,
    findWithSkipLimit,
    findCountPromise,
    findOneAndDeletePromise,
    pagination,
    findLastInsertId,
    findAllAndCountPromise,
    findSortBy
}
















