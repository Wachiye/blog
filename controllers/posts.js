const bcryptjs = require('bcryptjs'),
    url = require('url'),
    crypto = require("crypto"),
    IMG_DIR = __dirname +"/../public/img/posts/",
    salt = 10

//connection
const conn = require("./db")
global.conn = conn

//creating new post
exports.createPost = async (req, res) => {
    //console.log(req.files.image)
    let id = crypto.randomBytes(5).toString('hex'),
    title = conn.escape(req.body.title),
    excerpt = conn.escape(req.body.excerpt),
    author =    req.session.user.username,
    content = conn.escape(req.body.content),
    image = req.files.image,

    sql = `INSERT INTO posts(id, author, title, excerpt, content, image)
        VALUES('${id}','${author}',${title},${excerpt},${content},'${id}.jpg') `
    //console.log(sql) 
    image.mv(IMG_DIR +`${id}.jpg`, (err) => {
       conn.query(sql, (err, results) =>{
            res.redirect( url.format({ pathname: `/view=${id}`}))
        })
    })
}

//verifying the image
var checkImage = (image) =>{
    let status = 0;
    if(!image || image == undefined){
        status = 0;
    }
}

//deleting post
exports.deletePost = (req, res) => {
    let id = req.params.id
    //qery string
    let sql = `DELETE FROM posts WHERE id = '${id}'`
     conn.query ( sql, ( err, results) =>{
        if(!err){
            res.redirect(301, "/posts")
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
            }
            if (sql != "SELECT COUNT(id) as posts FROM posts") {
                resolve(data)
            }
            else{
                resolve(data)
            }
        })
    })
}
//display all post
exports.allPosts = (req, res, next) => {
    //query string for last 7 posts
    let sql = "SELECT posts.*, sum(views) as AllViews, sum(comments) as AllComments FROM posts ORDER BY dateCreated DESC LIMIT 15"

    //run query
    conn.query ( sql, ( err, results) =>{
        all = results
        if(all.length == 0){
            alert("No posts yet")
        }
        else{
            let view = all[0]
            if(req.session.type == "admin" ){
                let posts = all.length,
                    comments = all[0].AllComments
                    views = all[0].AllViews
                    //console.log(comments, views)
                res.render("admin/posts", {info, req, all, unreadComments, posts, views, comments})
            }
            else{
                res.render("posts", {info, req, view, all})
            }
        }
    })
}


//display selected post
exports.viewPost = (req, res) =>{
    //console.log(req.params.id)
    let id = req.params.id
    //  //sql string
    let sql = `SELECT * FROM posts WHERE id ='${id}'`

    conn.query ( sql, ( err, results) =>{
        if( !err){
            view = results[0]
            res.render("posts", {info, req, view, all})
        }
    }) 
}

//hashing the id
var hash = (id) => {
    return new Promise(resolve => {
       id = crypto.randomBytes(16).toString('hex')
       resolve(id)
    })
}