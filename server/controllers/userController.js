const { comparePassword } = require('../helpers/bcrypt.js')
const {user} = require('../models/index.js')
const { generateToken } = require('../helpers/jwt.js')

class UserController{
    static register(req, res, next) {
        user.findOne({
            where: {email: req.body.email}
        })
        .then(result => {
            if (!result) {
                return user.create({
                    email: req.body.email,
                    password: req.body.password
                })
            } else {
                throw{
                    name: "LoginError",
                    message: `Email already exists`
                }
            }

        })
        .then(result => {
            res.status(201).json({
                message: "user created"
            })
        })
        .catch(err => {
            next(err)
        })
    }

    static login(req, res, next){
        user.findOne({
            where: {email: req.body.email}
        })
        .then(result => {
            if (!result) {
                throw{
                    name: "LoginError",
                    message: `User Or Password Incorrect"`
                }
            }

            const checkPW = comparePassword(req.body.password, result.password)

            if (!checkPW){
                throw {
                    name: "LoginError",
                    message: "User Or Password Incorrect"
                }
            }

            const token = generateToken({
                id: result.id,
                email: result.email,
            });

            res.status(200).json({
                access_token: token,
            })
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = UserController;   