const { verifyToken } = require('../helpers/jwt');
const {user} = require('../models')
const {favorite} = require('../models')

function authentication(req, res, next){
    try{
        const {access_token} = req.headers;
        const dataDecoded = verifyToken(access_token);

        user.findOne({
            where: {id: dataDecoded.id}
        })
        .then(result =>{
            if(!result) {
                throw{
                    name: "AuthenticationError",
                    message: `user with id: ${dataDecoded.id} not found`,
                }
            }

            req.currentUser = {
                id: result.id,
            }
            next();
        })
        .catch(err => {
            next(err)
        })
    } catch (error) {
        next(error)
    }
}

const authorization = (req, res, next) => {
    const {id} = req.params;
    
    favorite.findOne({
        where: {id: id}
    })
    .then(result => {
        if (!result){
            throw {
                name: "AuthorizationError",
                message: `Gallery List with id ${id} not found`
            }
        }
        if (result.UserId == req.currentUser.id){
            return next();
        } else {
            throw{
                name: "AuthorizationError",
                message: `user with id ${req.currentUser.id} does not have permission`
            }
        }
    })
    .catch(err => {
        next(err)
    })
}

module.exports= {
    authentication, authorization
}