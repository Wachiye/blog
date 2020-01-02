const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const users = require('../controllers/users')
const posts = require('../controllers/posts')
const comments = require("../controllers/comments")
const conn = require("../controllers/db")
const categories = require("../controllers/categories")
//const mailer = require("../mail/mailer")
const bodyParser = require("body-parser")
const { config, engine} = require("express-edge")
const IMG_DIR = __dirname +"/../public/img/users/"
const uploader = require("express-fileupload")
//config({ cache: process.env.NODE_ENV === 'development'})

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))
router.use(engine)
router.use(uploader())
//global.conn = conn

var signup = (req, res) =>{
    res.render("signup", {info, all})
}

var verifyLogin = (req, res, next)=>{
    if(info.loggedIn){
        next()
    }
    else{
        res.render("login",{info, all})
    }
}

var logout = (req, res)=>{
    info.loggedIn = false
    info.user = []
    res.redirect(301,"/")
}

var newPost = async (req, res)=>{
    res.render("newPost",{info, all, posts: all, categories : cats})
}

var dashboard = (req, res) =>{
    res.render("dashboard", {info})
}

//checks for post errors
var signupErrors = (req, res, next) =>{

    let username = req.body.username,
        password = req.body.password,
        confirmPassword = req.body.confirmPassword
    
    if(password.length < 6 ){
        errors = `Error. Password too short`
        res.render("signup",{info, errors: `${errors}`})
    }
    else if(password !== confirmPassword){
        errors = "Error. Passwords don't match"
        res.render("signup", {info, errors: `${errors}`})
    }
    else{
        next()
    }
}

//validating user
var validateUser = (req, res, next) =>{
    //console.log(info)
    if(info.user.category == "Administrator"){
        next()
    }
    else{
        res.send("Access denied. You must be authorized to access this content.")
    }
}

//check user action
var action = (req, res) =>{
    let action = req.params.action
    let id = req.params.id
    let category = info.user.category
    if(action == 'edit'){
        //route for admins
        if( category == "Administrator")
            users.editAdminProfile(req, res)
        else
            users.editProfile(req, res)
    }

    if( action == 'pwd'){
        users.changePassword(req, res)
    }

    if( action != 'edit' && action !='pwd')
    {
        res.redirect(301,"/profile")
    }
    
}

var UserAction = (req, res)=>{
    let action = req.params.action
    let id = req.params.id
    if( action == "change"){
        users.changePriviledge(req, res)
    }

    if( action == "del"){
        users.deleteUser(req, res)
    }
}
//all posts
var all = posts.getAll("SELECT * FROM posts LIMIT 7")
var cats = categories.getCategories()
var unreadComments = comments.unread()
global.all = all
global.cats = cats;
global.unread = unreadComments

//logout route
router.get("/logout", logout)

//login routes
router.get("/login", verifyLogin)
router.post("/login", auth.login)

//singup routes
router.get("/signup", signup)
router.post("/signup", signupErrors, auth.register) 
//posts routes
router.get("/posts", posts.allPosts)
router.get('/view=:id', posts.viewPost)

//about route
router.get("/about", (req, res)=>{
    res.render("about",{info, all})
})

//profile routes
router.get("/profile", verifyLogin, users.getProfile)
router.post("/profile/action/:action", verifyLogin, action)
router.get("/unsubscribe", verifyLogin, users.deleteProfile)
//create post route
router.get("/new-post", validateUser, newPost)
router.post("/new-post", posts.createPost)
router.post("/posts=:id/comment", comments.comment)

//users route
router.get("/users", validateUser, users.allUsers)
router.all("/users/:id/:action", verifyLogin, UserAction)

//comments routes
router.get("/comments", validateUser, comments.comments)
router.get("/comments/:id/:action", comments.accept)

//category routes
router.get("/categories", categories.categories)
router.post("/categories/add", categories.addCategory)
router.get("/categories/:id/del", categories.removeCategory)

module.exports = router