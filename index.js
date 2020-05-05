const express = require("express")
const path = require("path")
const conn = require("./controllers/db")
const settings = require("./controllers/settings")
const uploader = require("express-fileupload")
const app = express()
const router = require('./routes/main.routes')
const comments = require('./controllers/comments')
const { config, engine} = require("express-edge")

config({ cache: process.env.NODE_ENV === 'production'})

//path to static file
app.use(express.static(path.join(__dirname,"/public/")))


//middleware
app.use(router)
app.use(uploader())
app.use(engine)

global.conn = conn

var site_author = {
    name : "Wachiye Jeremiah Siranjofu",
    email:"siranjofuw@gmail.com"
}

app.set("views", __dirname+"/views")
//basic site info
var site = {
    title : "ExpD:: Explorers & Developers",
    subtitle: "Yes, WE Can",
    site: "expd.co.ke",
    email: "siranjofuw@gmail.com",
    author: site_author,
    facebook: "https://www.facebook.com/expd",
    twitter : "https://www.twitter.com/",
    github: "https://www.github.com/Wachiye"
}

global.info = site

//port accessibility
app.listen( process.env.PORT || 8090 )