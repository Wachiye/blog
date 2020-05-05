//commenting on a post
exports.comment = (req, res)=>{
    //get the comment payload
    let user = '',
        post = req.params.id,
        message = req.body.message
        if(req.session.user != undefined)
        {
            user = req.session.user.id
        }
        else
        {

        }
    //create sql query
    let sql = `INSERT INTO comments( user_id, post_id, comment) VALUES( ${user}, '${post}', '${message}')`

    //run query
    conn.query( sql, (err, data)=>{
        res.redirect(301,"/view="+user)
    })
}

//get all comments
exports.comments = (req, res)=>{
    //sql query
    let sql = "SELECT comments.id, username, post_id,title as post,comment,date FROM users, comments,posts WHERE comments.user_id = users.id and comments.post_id = posts.id and Approved != 'Trashed'";
    //execute query
    conn.query(sql, (err, comments)=>{
        res.render("admin/comments", {info, req, comments, unreadComments})
    })
}

//get profile comments
exports.myComments = (req, res) =>{
    return new Promise( resolve =>{
        let id = req.session.user.id
        //sql
        let sql = `SELECT comments.id, comment AS message, title AS post_title, image AS post_image, post_id FROM comments INNER JOIN posts ON posts.id = post_id WHERE user_id =${id}`
        //get comments
        conn.query(sql, (err, myComments) =>{
           resolve( myComments)
        })
    })
}
//approving or marking comment as trash
exports.accept = (req, res) =>{
    let sql = '',
        id = req.params.id,
        action = req.params.action

    //check action
    if(action == 'approve'){
        sql = `UPDATE comments SET approved ='Approved', status ='Read' WHERE id=${id}`
    }
    else{
        sql = `UPDATE comments SET approved ='Trashed', status ='Read' WHERE id=${id}`
    }
    
    //execute query
    conn.query( sql, (err, data) =>{
        //if no error, redirect to comments route
       res.redirect(301,"/comments")
    })
}

exports.unread = (sql, count = false)=>{
    return new Promise( resolve =>{
        conn.query(sql, (err, data)=>{
            if(count){
                resolve(data.length)
            }
            else{
                resolve(data)
            }
        })
    })   
}