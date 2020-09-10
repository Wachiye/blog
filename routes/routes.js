const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const stats = require('../controllers/views')
const users = require('../controllers/users')
const subscribers = require('../controllers/subscribers')
const posts = require('../controllers/posts')
const comments = require("../controllers/comments")
const contacts = require("../controllers/contacts")
const testimonials = require('../controllers/testimonials')
const services = require("../controllers/services")
const conn = require("../controllers/db")
const categories = require("../controllers/categories")
const settings = require("../controllers/settings")
const members = require("../controllers/members")
const teams = require('../controllers/teams')
const mailer = require("../mail/mailer")
const bodyParser = require("body-parser")
const session = require("express-session")
const { config, engine} = require("express-edge")
const IMG_DIR = __dirname +"/../public/img/users/"
const uploader = require("express-fileupload")
const url = require('url')
const connectMongo = require('connect-mongo')
const mongoose = require("mongoose")
const mongoStore = connectMongo(session)
//config({ cache: process.env.NODE_ENV === 'development'})

var verifyLogin = (req, res, next)=>{
    if(req.session.loggedIn){
        next()
    }
    else{
        res.render("login",{info, req})
    }
}

//validating user
var validateUser = function(req, res, next){
    //console.log(info)
    if( req.session.loggedIn && req.session.type == 'Administrator'){
        next()
    }
    else{
        res.redirect(303, '/login')
    }
}
// establish mongo db connection which is necessary for session storage
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/expldblog" ,
    {useUnifiedTopology: true, useNewUrlParser: true}, 
    function (err) {
        console.log('connecting to mongo')
        if(!err){
            console.log("Mongo connected")
        }
        else{
            console.log(err)
        }
    }
)
// session storage
router.use(session({
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    }),
    secret: 'iikkii',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
    }
}))

router.use(engine)
router.use(uploader())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))
//index route
router.get("/", async(req,res)=>{
    req.session.page = 'Home'
    if(req.xhr || req.accepts('json,html') === 'json'){
        res.send(info)
    }
    else{
        if(info.admins == 0 ){
            res.render("setup",{info, req})
        }
        else{
            res.render("index",{info, req})
        }
    }
})
//about route
router.get("/about", async(req, res)=>{
    req.session.page = 'About Us'
    team_members = await members.getMembers()
    if(req.xhr || req.accepts('json,html') === 'json'){
        res.send(info)
    }
    else{
        info.teams_members = team_members.members
        // console.log(info)
        res.render("about",{info, req})
    }
})

//logout route
router.get("/logout", verifyLogin, auth.logout)
//login routes
router.get("/login", verifyLogin, auth.serveLoginPage)
router.post("/login", auth.login)
router.get("/dashboard", validateUser, stats.serveDashboard)
//singup routes
router.get("/signup", (req, res)=>{
    //user cant singup while logged in
    if(req.session.loggedIn){
        return false
    }
    else{
        req.session.page = 'Signup'
        res.render("signup", {info, req})
    }
})
router.post("/signup", auth.register) 

//posts routes
router.get("/posts", posts.allPosts, posts.getByCategory)
//other post routes
router.get("/newpost", validateUser, posts.serveNewPostPage)
router.post("/savepost", validateUser, posts.savePost)
router.get("/savepost?action=edit&id={{post.id}}", validateUser, posts.serveNewPostPage)
router.post("/savepost?action=edit&id={{post.id}}", validateUser, posts.savePost)
router.post("/posts/:id/comment", comments.comment)
router.all("/posts/:id/del", validateUser, posts.deletePost)
router.all("/posts/del/:ids", validateUser, posts.deletePosts)
router.get('/view=:id', posts.viewPost)


//profile routes
router.get("/profile", validateUser, users.serveProfilePage)
router.post("/profile/:id/edit", validateUser, users.editProfile)
router.post("/profile/:id/image", validateUser, users.changeImage)
router.post("/profile/:id/pwd", validateUser, users.changePassword)

// subscriber routes
router.post("/subscribe", subscribers.subscribe)
router.get("/subscribers", validateUser, subscribers.serveSubscribersPage)
router.get("/subscribers/view=new", validateUser, subscribers.serveSubscribersPage)
router.all("/subscribers/:id/unsubscribe", subscribers.unsubscribeOne)
router.post("/subscribers/unsubscribe/:ids", subscribers.unsubscribeMany)

//users route
router.get("/users", validateUser, users.serveUsersPage)
router.all("/users/:id/del", validateUser, users.deleteUser)
router.post("/users/:id/change", validateUser, users.changePriviledge)
router.post('/users/del:ids', validateUser, users.deleteUsers)
router.get("/admins", validateUser, users.serveAdminsPage)
//comments routes
router.get("/comments", validateUser, comments.serveCommentsPage)
router.get("comments?view=unread", validateUser, comments.serveCommentsPage)
router.all("/comments/:id/read", validateUser, comments.markCommentAsRead)
router.all("/comments/:id/approve", validateUser, comments.approveComment)
router.all("/comments/:id/del", validateUser, comments.deleteComment)
router.all("/comments/read/:ids", validateUser, comments.markCommentsAsRead)
router.all("/comments/approve/:ids", validateUser, comments.approveComments)
router.all("/comments/del/:ids", validateUser, comments.deleteComments)

//category routes
router.get("/categories", validateUser, categories.serveCategoriesPage)
router.post("/categories/add", validateUser, categories.addCategory)
router.all("/categories/:id/del", validateUser, categories.removeCategory)

//contact route
router.get("/contact", contacts.serveContactPage)
router.post("/contact", contacts.saveContact)
router.get("/contacts", validateUser, contacts.serveContactsPage)
router.get("/contacts?view=unread", contacts.serveContactPage)
router.all("/contacts/:id/read", validateUser, contacts.markContactAsRead)
router.all("/contacts/read/:ids", validateUser, contacts.markContactsAsRead)
router.all("/contacts/:id/del", validateUser, contacts.deleteContact)
router.all("/contacts/del/:ids", validateUser, contacts.deleteContacts)

//services routes
router.get("/services", validateUser, services.serveServicesPage)
router.post("/services", validateUser, services.addService)
router.all("/services/:id/del", validateUser, services.deleteService)

//testimonials routes
router.get('/testimonials', testimonials.serveTestimonialsPage)
router.post('/testimonials/testify', testimonials.addTestimonial)
router.all('/testimonials/:id/approve', validateUser, testimonials.approveTestimonial)
router.all('/testimonials/:id/del', validateUser, testimonials.deleteTestimonial)

//team members
router.get("/members", members.serveMembersPage)
router.get("/members?view=new", members.serveMembersPage)
router.get("/new-member", validateUser, members.serveNewMemberPage)
router.post("/members/add", validateUser, members.addMember)
router.post("/members/:id/edit", validateUser, members.editMember)
router.all("/members/:id/del", validateUser, members.deleteMember)
router.all("/members/del/:ids", validateUser, members.deleteMembers)

//teams routes
router.get('/teams', validateUser, teams.serveTeamsPage)
router.post('/teams', validateUser, teams.addTeam)
router.post('/teams/:id/update', validateUser, teams.editTeam)
router.all('/teams/:id/del', validateUser, teams.deleteTeam)

//settings routes
router.get("/settings", validateUser, settings.serveSettingsPage)
router.post("/settings/basic", validateUser, settings.setBasics)
router.post("/settings/services/description", validateUser, settings.setServicesDescription)
router.post("/settings/mission", validateUser, settings.setMissionStatement)
router.post("/settings/teams/description", validateUser, settings.setTeamsDescription)
router.post("/settings/favicon", validateUser, settings.setFavicon)
router.post("/settings/contacts", validateUser, settings.setContacts)
router.post("/settings/media", validateUser, settings.setMedia)
router.all("/settings/media/:media/del", validateUser, settings.deleteMedia)


//privacy policy
router.get("/privacy-policy", (req, res)=>{
   req.session.page = 'Privacy Policy'
   res.render("privacyPolicy",{info, req}) 
})
router.post('/addview', stats.addView)

//page not found response
router.use( function(req, res, next){
    res.render("not-found", {info, req})
})
//serer error response
router.use( function(err, req, res, next){
    console.error(err.stack)
    res.type('text/plain')
    res.status(500)
    res.send('500- Server Error')
})
module.exports = router