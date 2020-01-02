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
    title = req.body.title,
    excerpt = req.body.excerpt,
    author =    info.user.username,
    content = req.body.content,
    image = req.files.image,

    sql = `INSERT INTO posts(id, author, title, excerpt, content, image)
        VALUES('${id}','${author}','${title}','${excerpt}','${content}','${id}.jpg') `
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
// exports.deletePost = (req, res) => {
//     //let id = req.body.id
//     //qery string
//     let sql = `DELETE FROM posts WHERE id = '${id}'`
//      conn.query ( sql, ( err, results) =>{
//         if( !err){
//             res.render("posts", {info, allPosts})
//         }
//     })
// }

exports.getAll = ( sql) =>{

    conn.query ( sql, ( err, results) =>{
        if( !err){
            all = results
            return all
        }
        else{
            return []
        }
    })
}
//display all post
exports.allPosts = (req, res, next) => {
    //query string for last 7 posts
    let sql = "SELECT * FROM posts ORDER BY dateCreated DESC LIMIT 15"

    //run query
    conn.query ( sql, ( err, results) =>{
        all = results
        if(all.length == 0){
            alert("No posts yet")
        }
        else{
            let view = all[0]
            view.content = view.content.split(/\r\n/)

            if(info.user.category == "Subscriber" || info.user.category == undefined){
                res.render("posts", {info, view, all})
            }
            else{
                res.render("admin-posts", {info, all})
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
            view.content = view.content.split(/\r\n/)
            //console.log(view.content)
            res.render("posts", {info, view, all})
        }
    }) 
}

//preview post
exports.previewPost = (req, res) =>{
    view = {
        id :crypto.randomBytes(5).toString('hex'),
        title :req.body.title,
        excerpt :req.body.excerpt,
        content :req.body.content.split(/\r\n/),
        image :req.files.image,
        category :req.body.category,
        tags :req.body.tags,
        related_post: req.body.related_post
    }
    res.redirect("/posts", {info, view, all})
}

//hashing the id
var hash = (id) => {
    return new Promise(resolve => {
       id = crypto.randomBytes(16).toString('hex')
       resolve(id)
    })
}