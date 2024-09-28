const user = require('../models/users')

const saveUser = async (fullname, email, username, password) => {
    return new Promise ((resolve, reject) => {
        const newUser = new user({
            fullname: fullname,
            email: email,
            username: username,
            password: password,
        })

        newUser.save()
            .then(userResult => {
                resolve(userResult)
            })
            .catch(error => {
                reject(error)
            })
    })
}

const findByUsername = async (username) => {
    return new Promise ((resolve, reject) => {
        user.findOne({username})
            .then(userResult => {
                resolve(userResult);
            })
            .catch(error => {
                reject(error);
            })
    });
}

const findById = async (_id) => {
    return new Promise ((resolve, reject) => {
        user.findOne({_id})
            .then(userResult => {
                resolve(userResult)
            })
            .catch(error => {
                reject(error)
            })
    })
}

module.exports = {
    saveUser,
    findByUsername,
    findById,
}