'use strict'

const {favorite} = require('../models/index.js');

class favoriteController{
    static toList(req, res, next){
        favorite.findAll({
            where: {userid: req.currentUser.id},
            order: ['id'],
        })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            next(err)
        })
    }

    static addData(req, res, next){
        console.log("ADD")
        req.body.UserId = req.currentUser.id
        favorite.create(req.body)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            next(err)
        })   
    }

    static deleteData(req, res, next){
        console.log("DELETE")
        favorite.findOne({
            where: {id: req.params.id}
        })
        .then(result => {
            if (!result) {
                throw ({
                    name: "NotFound",
                    message: `Favorite with Id ${req.params.id} Not Found`
                })
            } else {
                return favorite.destroy({
                    where: {
                        id: req.params.id
                    }
                })
            }
        })
        .then(() => {
            res.status(200).json({"message": "favorite news success to delete"})
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = favoriteController;