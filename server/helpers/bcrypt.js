const bcrypt = require("bcryptjs")

const hashPassword = (userPassword) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userPassword, salt);
    return hash;
}

const comparePassword = (userPassword, hashPassword) => {
    const isCorrect = bcrypt.compareSync(userPassword, hashPassword)
    return isCorrect
}

module.exports = {
    hashPassword, comparePassword,
}