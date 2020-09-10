const bcryptjs = require('bcryptjs'),
    url = require('url'),
    crypto = require("crypto"),
    IMG_DIR = __dirname +"/../public/img/posts/",
    salt = 10
const categories = require("../controllers/categories")


var postsStats = (sql) =>{
    return new Promise( resolve=>{
       conn.query(sql, (err, stats)=> {
            if(err){
                console.log(err)
                resolve([
                    allPosts = 0,
                    AllViews= 0,
                    AllComments = 0
                ])
            }
            else
            {
                resolve(stats[0])
            }
        }) 
    })  
}
//hashing the id
var hash = (id) => {
    return new Promise(resolve => {
       id = crypto.randomBytes(16).toString('hex')
       resolve(id)
    })
}
//connection
const conn = require("./db")
global.conn = conn

//serving the new post page or for editing a post given the id and the edit action request
exports.serveNewPostPage = async (req, res)=>{
    //get post categories
    categores = await categories.getCategories()
    data = {
        "categories" :categories
    }
    //check if the request if for editing post:only one post will be returned if so
    if(req.query.action && req.query.id){
        // console.log(req.query)
        let id = conn.escape(req.query.id),
        data = {
            "found":true
        }

        conn.query(`SELECT * FROM posts WHERE id =${id} LIMIT 1`, (err, post)=>{
            //console.log(post)
            if(err){
                console.error(err)
                data = {
                    "found" :false,
                    "message":{
                        "type":"DB_ERR",
                        "ERR": err.message
                    },
                    "categores": categores,
                    "post":posts[0]
                }
            }
        })
    }
    if(req.xhr || req.accepts('json,html') === 'json'){
        res.send(data)
    }
    else{  
        res.render("admin/newPost",{info, req, categores })
    }
}
//creating/saving a new post
exports.savePost = async (req, res) => {
    // console.log(req.body)
    // res.setHeader('Content-Type',"application/json")
    var id = crypto.randomBytes(5).toString('hex')
    title = conn.escape(req.body.title),
    excerpt = conn.escape(req.body.excerpt),
    author =    req.session.user.username,
    content = conn.escape(req.body.content),
    category = conn.escape(req.body.category),
    default_tags = await this.getAll(`SELECT tags FROM categories WHERE name = ${category} LIMIT 1`),
    tags = conn.escape(req.body.tags + `, ${default_tags[0].tags}`) 
    if(req.files){
        var image = req.files.image
    }
    let data = {
        "type":"success",
        "message":`Your post has been published. <a href='/view=${id}'> View Post </a>`
    },
    sql = `INSERT INTO posts(id, author, title, excerpt, content,category, tags, image)
        VALUES('${id}','${author}',${title},${excerpt},${content},${category},${tags},'${id}.jpg') `
    //check if its an update request and modify the sql query
    if(req.query.action && req.query.id){
        req_id = req.query.id
        image_name = req_id
        id = conn.escape(req_id)
        tags = conn.escape(req.body.tags)
        sql = `UPDATE posts SET author= '${author}', title = ${title}, 
            excerpt = ${excerpt}, content = ${content}, category=${category},
            tags =${tags},image ='${image_name}.jpg' WHERE id=${id} `
    }
    // console.log(sql)
    // save image if supplied
    if(req.files){
        if(!req.query.action && !req.query.id)
            image_name = id + 'jpg'
    
        image.mv(IMG_DIR + image_name +'.jpg', (err) => {
            if( err){
                data = {
                    "type":"danger",
                    "message":{
                        "type":"IMG_UPLOAD_ERR",
                        "ERR": err.message 
                    }
                }  
            }
        })
    }
    //save data to the db
    conn.query(sql, (err, post) =>{
        if(err){
            data = {
                "type":"danger",
                "saved":false,
                "message":{
                    "type":"DB_ERR",
                    "ERR": err.message
                }
            }
            console.error(err)
        }
        else{
          data={
            "type":"success",
            "saved": true,
            "post":post
          }  
        }
        if(req.xhr || req.accepts('json,html') === 'json'){
            res.send(data)
        }
        else{
            res.render("admin/newPost", {req, info})
        }
    })
}

//deleting post
exports.deletePost = (req, res) => {
    let id = req.params.id
    //qery string
    let sql = `DELETE FROM posts WHERE id = '${id}'`
     conn.query ( sql, ( err, post) =>{
        if(err){
            data = {
                "type":"danger",
                "deleted":false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else{
            data ={
                "type":"success",
                "deleted": true,
                "post":post
            }
        }
        if(req.xhr || req.accepts('json,html') === 'json'){
            res.send(data)
        }
        else
        {
            res.redirect(303, '/posts')
        }
    })
}
exports.deletePosts = (req, res) => {
    let ids = req.params.ids //comes as an array of ids separated by commas
    //qery string
    let sql = `DELETE FROM posts WHERE id in (${ids})`
     conn.query ( sql, ( err, posts) =>{
        if(err){
            data = {
                "type":"danger",
                "deleted":false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else{
            data ={
                "type":"success",
                "deleted": true,
                "posts":posts
            }
        }
        if(req.xhr || req.accepts('json,html') === 'json'){
            res.send(data)
        }
        else
        {
            res.redirect(303, '/posts')
        }
    })
}
exports.getAll = ( sql) =>{
    return new Promise( async resolve =>{
        let data = []
        conn.query ( sql, ( err, results) =>{
            if( !err){
                all = results
                data = results
                resolve(data)
            }
            else{
                resolve([])
                console.error(err)
            }
        })
    })
}
//display all post
exports.allPosts = async(req, res, next) => {
    req.session.page = 'Blog Posts'
    // if req has category, go to get by category
    if(req.query.category){
        next()
    }
    else{
        //query string for recent posts posts
        let sql = "SELECT * from posts ORDER BY dateCreated DESC LIMIT 0, 15"
        let categories = await this.getAll('SELECT name FROM categories')
        //run query
        conn.query ( sql, async( err, posts) =>{
            if(err){
                data ={
                    "type":"danger",
                    "posts":[],
                    "message":{
                        "type":"DB_ERR",
                        "ERR":err.message
                    }
                }
            }
            else
            {
                data ={
                    "type":"success",
                    "posts":posts,
                    "categories": categories
                }
            }
            
            if(req.xhr || req.accepts('json,html') === 'json'){
                res.send(data)
            }else
            {
                if(req.session.loggedIn && req.session.type == 'Administrator')
                    res.render("admin/posts", {info, req, posts})
                else
                    res.render("posts", {info, req, posts, categories})
            }
        })
    }
}

//get all posts by category
exports.getByCategory = async(req, res)=>{
    // console.log(req.query)
    let category = conn.escape(req.query.category),
        sql = `SELECT * FROM posts WHERE category = ${category}`
    let categories = await this.getAll('SELECT name FROM categories')
    conn.query(sql, async(err, posts)=>{
        if(err){
            console.error(err)
            data = {
                "type":"danger",
                "posts":[],
                "categories": categories,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else
        {
            data = {
                "type":"success",
                "posts":posts,
                "categories":categories
            }
        }
       if(req.xhr || req.accepts('json,html') === 'json'){
            res.send(data)
       }
       else
       {
        if(req.session.loggedIn && req.session.type == 'Administrator')
            res.render("admin/posts",{info, req, posts, categories})
        else
            res.render("posts",{info, req, posts, categories})
       } 
    })
}
//display selected post
exports.viewPost = (req, res) =>{
    //console.log(req.params.id)
    let id = req.params.id
    //  //sql string
    let sql = `SELECT * FROM posts WHERE id ='${id}'`

    conn.query ( sql, async( err, post) =>{
        if(err){
            console.error(err)
            data = {
                "type":"danger",
                "post":[],
                "view":[],
                "postComments":[],
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }

            }
        }
        else
        {
            view = post[0]
            postComments = await this.getAll(`SELECT json_extract(user,'$.username') as username,
        json_extract(user,'$.email') as email, json_extract(user,'$.website') as website,comment,date
         from comments
         WHERE post_id = '${id}' and status = 'read' and approved = 'approved'`)
            postComments.forEach(function async(comment) {
                comment.username = comment.username.slice(1,-1)
                comment.email = comment.email.slice(1,-1)
                comment.website = comment.website.slice(1,-1)
                //console.log(comment)
            })
            posts = await this.getAll('SELECT id,title from posts')
            var postCategories = await this.getAll('SELECT name FROM categories')

            // console.log(posts)
            // console.log(postComments)
            data = {
                "type":"success",
                "posts":posts,
                "view":post[0],
                "postComments":postComments
            }
        }
        if(req.xhr || req.accepts('json,html') === 'json'){
            res.send(data)
        }
        else
        {
            res.render("post-view", {info, req, view, posts, postComments, postCategories})
        }
    }) 
}
