const hash = require("./hash")

exports.register = async (req, res) => {
    let username = req.body.username,
        email = req.body.email,
        fullname = req.body.fullname,
        password = await hash.hashPassword(req.body.password),
        sql = `INSERT INTO users(username, fullname, email, password) 
        VALUES('${username}', '${fullname}','${email}', '${password}')`

    conn.query(sql, (err, results) =>{
        if(err){
         res.render("signup", {info, errors: "Sorry, we are unable to create account. Please try again later"})
        }
        else
        {
            res.render("signup", {info, message: "Registration was successfull. You can log in now."})
        }
    })
}
//loging in users
exports.login = async (req, res, next) => {
    //console.log(req)
    let username = req.body.username,
        sql = `SELECT * FROM users WHERE username = '${username}'`
    conn.query(sql, async (err, results) => {
        if(err){
            console.log(err)
            res.render("login", {info, all})
        }else{
            if(results.length > 0){ // there is some users
               let valid = await hash.validUser(req.body.password, results[0].password)

               if(valid){ //user is authenticated
                    req.session.user = results[0]
                    let post = all [0]
                    req.session.loggedIn = true
                    //check user
                    if( req.session.user.category == "Subscriber"){
                        req.session.type = "user"
                    }
                    else{
                        req.session.type = "admin"
                    }

                    res.redirect(301,"/profile")
               }else{
                   res.render("login",{info, all, errors:"ExpD has noticed something wrong with your account. Access denied. We are sorry."})
               }
            }
            else{
                
                res.render("login",{info, all, errors:"Uknown User account."})
            }
        }
    })
}

//user logout
exports.logout = (req, res) => {
    console.log(req.session)
    req.session.destroy()
    console.log(req.session)
    res.redirect(301,'/')
}