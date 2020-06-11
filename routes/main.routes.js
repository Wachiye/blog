const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const users = require('../controllers/users')
const posts = require('../controllers/posts')
const comments = require("../controllers/comments")
const conn = require("../controllers/db")
const categories = require("../controllers/categories")
const settings = require("../controllers/settings")
const members = require("../controllers/members")
const mailer = require("../mail/mailer")
const bodyParser = require("body-parser")
const session = require("express-session")

//const MySQLStore = require('mysql-express-session')(session);

const { config, engine} = require("express-edge")
const IMG_DIR = __dirname +"/../public/img/users/"
const uploader = require("express-fileupload")
const url = require('url')
//config({ cache: process.env.NODE_ENV === 'development'})

require('dotenv').config()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

const MongoStore = require('connect-mongo')(session);


/* 
var options ={
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     pass: process.env.DB_PASS,
     database: process.env.DB_NAME,


     createDatabaseTable: true,
     schema: {
          tableName: 'sessions',
          columnNames: {
                session_id : 'session_id',
                expires: 'expires',
                data: 'data'
          }
     }
}

var session_store = new MySQLStore(options)

router.use(session({
     secret : '4CD5-56DF-wed5Tdw', 
     store: session_store,
     saveUninitialized: true,
     resave: true
}))

*/

router.use(session({
    store: new MongoStore({
        url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sessions-tvjpn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
    }
}));

router.use(engine)
router.use(uploader())

//SESSIONS

//global.conn = conn


var signup = (req, res) =>{
    res.render("signup", {info, all})
}

var verifyLogin = (req, res, next)=>{
    if(req.session.loggedIn){
        next()
    }
    else{
        res.render("login",{info, all})
    }
}


var newPost = async (req, res)=>{
    res.render("admin/newPost",{info, all, posts: all, categories : cats})
}

var dashboard = async(req, res) =>{
    let unread_comments_count = await comments.unread("SELECT * FROM comments  where status like '%unread%'", true)
    let comments_all = await comments.unread("SELECT * FROM comments WHERE approved !='Trashed'", true)
    let newPosts = await posts.getAll('SELECT COUNT(id) as new_posts from posts WHERE date(dateCreated) = curdate()')
    let newUsers = await users.allUsers('select count(id) as new_users from users where date(dateCreated) = curdate()')
    let users_count = await users.allUsers("SELECT COUNT(id) as all_users FROM users WHERE category = 'Subscriber'")
    let posts_count = await posts.getAll("SELECT COUNT(id) as posts FROM posts")
    let quote = "We were made to help each other. If you have something to teach us,do it. If not, listen to what we are teaching."
    res.render("admin/dashboard", {info, req, comments_unread: unread_comments_count, comments:comments_all, users: users_count, newUsers, posts:posts_count, newPosts, quote})
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
    if(req.session.type == "admin"){
        next()
    }
    else{
        res.redirect( url.format({ pathname: '/login'}))
    }
}

//all posts
global.all = posts.getAll("SELECT * FROM posts LIMIT 7")
var cats = categories.getCategories()
var unreadComments = comments.unread("SELECT * FROM comments WHERE status like '%unread%'", true)

global.cats = cats;
global.unreadComments = unreadComments

//index route
router.get("/", async (req,res) =>{
    res.render("index",{info, req})
})
//logout route
router.get("/logout", (req, res)=>{
    if(req.session){
        req.session.destroy( (err) =>{
            if( err){
                return err
            } else {
                return res.redirect("/")
            }
        })  
    }  
})
//login routes
router.get("/login", verifyLogin)
router.post("/login", auth.login)
router.get("/dashboard", validateUser, dashboard)
//singup routes
router.get("/signup", signup)
router.post("/signup", signupErrors, auth.register) 

//posts routes
router.get("/posts", posts.allPosts)
//create post route
router.get("/create", validateUser, newPost)
router.post("/create", validateUser, posts.createPost)
router.post("/posts/:id/comment", comments.comment)
router.get("/posts/:id/del", validateUser, posts.deletePost)
router.get('/view=:id', posts.viewPost)

//about route
router.get("/about", (req, res)=>{
    res.render("about",{info, all, req})
})

//profile routes
router.get("/profile", verifyLogin, users.getProfile)
router.post("/profile/:id/edit", verifyLogin, users.editProfile)
router.post("/profile/:id/image", verifyLogin, users.changeImage)
router.post("/profile/:id/pwd", verifyLogin, users.changePassword)
router.get("/unsubscribe", verifyLogin, users.deleteProfile)

//users route
router.get("/users", validateUser,  async(req, res) =>{
    let data =  await users.allUsers("SELECT * FROM users WHERE category = 'Subscriber'")
    res.render("admin/users",{info, users:data, req, unreadComments})
})
router.get("/users/:id/del", verifyLogin, users.deleteUser)
router.post("/users/:id/change", verifyLogin, users.changePriviledge)
router.get("/admins", validateUser, async(req, res) =>{
    let admins =  await users.allUsers("SELECT * FROM users WHERE category = 'Administrator'")
    res.render("admin/users",{info, users:admins, req, unreadComments})
})
//comments routes
router.get("/comments", validateUser, comments.comments)
router.get("/unread", validateUser, async(req, res) =>{
    let comment_s = await comments.unread("SELECT * FROM comments WHERE status like '%unread%'")
    res.render("admin/comments" , {info, req, comments:comment_s, unreadComments})
})
router.get("/comments/:id/:action", comments.accept)

//category routes
router.get("/categories", validateUser, categories.categories)
router.post("/categories/add", validateUser, categories.addCategory)
router.get("/categories/:id/del", validateUser, categories.removeCategory)

//settings routes
router.get("/settings", validateUser, async(req, res)=>{
    let data = await settings.getSettings(req, res)
    res.render("admin/settings", {info, req, unreadComments})
})
router.post("/settings/update", validateUser, settings.setSettings)

//contact route
router.get("/contact", (req, res) =>{
    res.render("contact", { info, req})
})

router.post("/contact", async(req, res) => {
    let from = req.body.email ,
        to = 'jerrysirah8@gmail.com',
        subject = "Contact From " + info.site,
        message = req.body.message
    let email_response = await mailer.sendEmail(from, to, subject, message)
    res.render("contact", { info, req, errors: email_response})
})

//team members
router.get("/members", members.getMembers)
router.get("/new-member", validateUser, (req, res)=>{
    res.render("admin/newMember", { info, req})
})
router.post("/members/add", validateUser, members.addMember)
router.get("/members/:id/edit", validateUser, members.editMember)
router.get("/members/:id/del", validateUser, members.deleteMember)
//page not found response
router.use((req, res) => res.render("not-found", {info, req}))

module.exports = router
