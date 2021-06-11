const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY_JWT;

const generateToken = (payload) => {
    try{
        const token = jwt.sign(payload, SECRET_KEY);
        console.log(token)   
        return token;
    } catch ( err ) {
        console.log(err)
    }
}

const verifyToken = (token) => {
    console.log("verify", token)
    const decoded = jwt.verify(token, SECRET_KEY)
    return decoded;
}

module.exports = {
    generateToken, verifyToken,
}