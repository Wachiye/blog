const bcryptjs = require('bcryptjs'),
    salt = 10

//compare password and username
exports.validUser = (password, hashedPassword) =>{
    return new Promise( async resolve =>{
        bcryptjs.compare(password, hashedPassword, (err, res) => {
            //passwords don't match
            if(err || !res){
                console.log(password, hashedPassword)
                resolve(false)
            }else{ //passwords match
                console.log(password, hashedPassword)
                resolve(true)
            }
        })
    })
}

//hashing the password
exports.hashPassword = (password) => {
    return new Promise(resolve => {
        bcryptjs.hash(password,salt, (err, hash)=>{
            if(!err){
                resolve(hash)
            }
        })
    })
}