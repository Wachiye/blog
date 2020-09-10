const hash = require("./hash")

//register a user
exports.register = async (req, res) => {
    //get body data
    let username = req.body.username,
        email = req.body.email,
        fullname = req.body.fullname,
        password = await hash.hashPassword(req.body.password),
        sql = `INSERT INTO users(username, fullname, email, password) 
        VALUES(?,?,?,?)`,
        data = {
            "type":"success",
            "saved":true
        }, isNew = req.body.new
        if(isNew){
            console.log("is new")
           sql = `INSERT INTO users(username, fullname, email, password, category) 
        VALUES(?,?,?,?,'Administrator')`
        }
    conn.query(sql,[ username, fullname, email, password], async(err, user) =>{
        // on error
        if(err){
            console.error(err)
            data = {
                "type":"danger",
                "saved":false,
                "message":{
                    "type": "DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else{
            data = {
                "type":"success",
                "saved":true,
                "user": user
            }
        }
        if(req.xhr || req.accepts('json,html') === 'json'){
            res.send(data)
        }
        else
        {
            res.redirect(303,'/signup')
        }
    })
}
//display login page
exports.serveLoginPage = (req, res)=>{
    req.session.page = 'Login'
    res.render('login', {info, req})
}
// login to system
exports.login = async (req, res, next) => {
    //console.log(req)
    var username = conn.escape(req.body.username),
        password = req.body.password,
        valid = true
    let sql =    `SELECT * FROM users 
        where username = ${username} LIMIT 1`
    // fetch user with given username and password
    conn.query(sql, async (err, users) => {
        if(err){
            console.error(err)
            valid = false
            data = {
                "type":"danger",
                "loggedIn":false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else
        {
            valid = await hash.validUser(password, users[0].password)
            if(valid){
             // console.log(users[0])
              //set session values
                req.session.user = users[0]
                req.session.type = users[0].category
                req.session.loggedIn = true
                data = {
                    "loggedIn":true,
                    "type":"success",
                    "loggedIn":true,
                    "user":users[0]
                }
            }
            else
            {
                valid = false
                 data ={
                    "type":"danger",
                    "loggedIn":false,
                    "user":[],
                    "message":{
                        "type":"AC_ERR",
                        "ERR":"Username/Passwords don't match. Try again later"
                    }
                }
            }
        }              
        if(req.xhr || req.accepts('json,html')==='json')
        {
            //return json if req accepts json
            res.send(data)
        }
        else
        {
            //check session type  and direct accordingly for normal responses
            if(req.session.category == 'Administrator' && users[0].category == 'Administrator'){
                res.redirect(303, '/dashboard')
            }
            else{
                res.redirect(303, "/")
            }
        }
    })
}
//user logout
exports.logout = (req, res) => {
    //must be loggedin or session should be active
    if(req.session.loggedIn){
        // destroty active session
        req.session.destroy( (err)=>{
            // on error
            if(err){
                console.error(err)
                data = {
                    "type":"danger",
                    "loggedOut":false,
                    "message":{
                        "type":"SESSION_ERR",
                        "ERR": err.message 
                    }
                }
            }
            else{
                data = {
                    "type":"success",
                    "loggedOut":true
                }
            }
           
            if(req.xhr || req.accepts('json,html') === 'json'){
                res.send(data)
            }
            else{
                res.redirect(303, '/')
            }
        })
    } 
}