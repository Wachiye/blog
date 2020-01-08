const exp= require("express")
const path = require("path")
const conn = require("./controllers/db")
const uploader = require("express-fileupload")
const app = new exp()
const router = require('./routes/main.routes')
const comments = require('./controllers/comments')
const { config, engine} = require("express-edge")

config({ cache: process.env.NODE_ENV === 'production'})

//path to static file
app.use(exp.static(path.join(__dirname,"/public/")))

//middleware
app.use(router)
app.use(uploader())
app.use(engine)

global.conn = conn

app.set("views", __dirname+"/views")

//basic site info
var site = {
    title : "ExpD:: Explorers & Developers",
    subtitle: "Yes, WE Can",
    site: "expd.co.ke",
    author:{
        name : "Wachiye Jeremiah Siranjofu",
        emailLink :"mailto:siranjofuw@gmail.com?Subject=ExpD::Contact",
        email:"siranjofuw@gmail.com"
    }, 
    loggedIn : false,
    user :{
        id : undefined,
        username : undefined,
        fullname: undefined,
        email: undefined,
        category: undefined,
        role: undefined
    },
    unread : 0
}

global.info = site

//index route
app.get("/", (req,res) =>{
    res.render("index",{info,all})
})

//port accessibility
app.listen( process.env.PORT || 3000 )
