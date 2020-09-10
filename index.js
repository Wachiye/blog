require('dotenv').config()
const express = require("express")
const path = require("path")
const conn = require("./controllers/db")
const uploader = require("express-fileupload")
const app = express()
const router = require('./routes/routes')
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
var PORT = process.env.PORT || 3000
app.set("views", __dirname+"/views")

var site = {
	site: [],
	author: site_author,
}
global.info = site
//port accessibility
app.listen(PORT, async(req, res)=>{
	console.log('Server is running...')
})