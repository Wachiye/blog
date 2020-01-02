const bcryptjs = require('bcryptjs'),
    salt = 10

//compare password and username
exports.validUser = (password, hashedPassword) =>{
    return new Promise( async resolve =>{
        bcryptjs.compare(password, hashedPassword, (err, res) => {
            //passwords don't match
            if(err || !res){
                resolve(false)
                return(false)
            }else{ //passwords match
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