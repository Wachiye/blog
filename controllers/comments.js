//commenting on a post
exports.comment = (req, res)=>{
    //get the comment payload
    let user = info.user.id
        post = req.params.id,
        message = req.body.message

    //create sql query
    let sql = `INSERT INTO comments( user_id, post_id, comment) VALUES( ${user}, '${post}', '${message}')`

    //run query
    conn.query( sql, (err, data)=>{
        res.redirect(301,"/posts")
    })
}

//get all comments
exports.comments = (req, res)=>{
    //sql query
    let sql = "SELECT comments.id, username, post_id,title as post,comment,date FROM users, comments,posts WHERE comments.user_id = users.id and comments.post_id = posts.id";
    //execute query
    conn.query(sql, (err, comments)=>{
        res.render("comments", {info, comments})
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
        info.unread = unread
        //if no error, redirect to comments route
       res.redirect(301,"/comments")
    })
}

exports.unread = ()=>{
    conn.query(" SELECT COUNT(id) as unread FROM comments WHERE status like '%Unread%'", (err, data)=>{
        if(err){
            return 0
        }
        else
        {
            info.unread = data[0].unread
            return data[0].unread
        }
    })
}