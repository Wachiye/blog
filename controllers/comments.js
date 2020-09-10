const subcribers = require('./subscribers')
//commenting on a post
exports.comment = async(req, res)=>{
	//get the comment payload
    if(req.session.loggedIn){ //FORM SESSION IF USER IF logged in
    	var username = req.session.user.username,
    		user_id = req.session.user.id,
    		email = req.session.user.email,
    		website = require.session.user.website
    }
    else{ //from body if user not logged in
    	var username = req.body.username
    	var email = req.body.email
    	var website = req.body.website
    }
    if(req.body.addme == 'addme'){//save use if addme specified
	   
	   let user_sql =`INSERT INTO subcribers(username, email, website, comments) 
	   		VALUES (?,?,?,?)`
    	user = await subcribers.subscribe_comment(user_sql,[username, email, website, 1])
        if(user == [])
        {
            user_id = 0
            data ={
                "type":"danger",
                "message":{
                    "type":"SUBSCRIPTION_ERR",
                    "ERR":"Could not be added to the subcribers list."
                }
            }
        }
        else{
            user_id = `"${user.insertId}"`
        }
    }else{
    	user_id = 0
    }
    user = `{"id": ${user_id},"username":"${username}","email": "${email}","website": "${website}"}`

    // console.log(user)
    message = conn.escape(req.body.message)
    post_id = req.params.id
    //create sql query
    let sql = `INSERT INTO comments( user, post_id, comment, date) VALUES('${user}','${post_id}',${message}, current_date())`

    //store the comment
    conn.query( sql, (err, comment)=>{
    	if(err){
    		console.error(err)
    		data = {
    			"type":"danger",
    			"commented":false,
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
                "commented":true
            }
        }
    	if(req.xhr || req.accepts('json,html') === 'json'){
    		res.send(data)
    	}
    	else{
    		res.redirect(303,"/view="+post_id)
    	} 
    })
}


//get all comments
exports.serveCommentsPage = async (req, res)=>{
    req.session.page = 'Comments'
    //sql query
    let sql = `SELECT id, json_extract(user,'$.username') as username,
    	json_extract(user,'$.email') as email, json_extract(user,'$.website') as website,comment,date,status,approved from comments`;
    if(req.query.view){
        sql = sql +  ` WHERE status = 'unread'`
    }
    sql = sql + ` ORDER BY id DESC`
    //execute query
    conn.query(sql, (err, comments)=>{
    	if(err){
    		console.error(err)
            data = {
                "type":"danger",
                "comments":[],
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
    	else
        {
    		comments.forEach(function async(comment) {
                comment.username = comment.username.slice(1,-1)
                comment.email = comment.email.slice(1,-1)
                comment.website = comment.website.slice(1,-1)
                // console.log(comment)
            })
            data = {
                "type":"success",
                "comments":comments
            }
    	}
        if(req.xhr || req.accepts('json,html') ==='json'){
            res.send(data)
        }
        else{
            res.render("admin/comments", {info, req, comments})
        }
    })
}

//get profile comments
exports.myComments = (req, res) =>{
    return new Promise( resolve =>{
        let id = req.session.user.id
        //sql
        let sql = `SELECT id, comment, post_id, date 
        	FROM comments 
        	WHERE 
        	JSON_EXTRACT(user, '$.id') = ${id}`
        //get comments
        conn.query(sql, (err, myComments) =>{
           resolve( myComments)
        })
    })
}
//marking a comment as read: does not approve the comment
exports.markCommentAsRead = (req, res)=>{
	var id = req.params.id
	var sql = `UPDATE comments SET status = 'read'
		WHERE id = ${id}`,
	success = true
    //execute query
    conn.query( sql, (err, comments) =>{
    	if(err){
    		console.error(err)
    		data = {
                "type":"danger",
                "read": false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
    	}
        else{
            console.log(comments)
            data = {
                "type":"success",
                "read": true
            }
        }
    	if (req.xhr || req.accepts('json,html') === 'json') {
            console.log(data)
    		res.send(data)
    	}
    	else
        {
       		res.redirect(303,"/comments")
       	}
    })
}
//marking comments as read in bulk: does not approve comments
exports.markCommentsAsRead = (req, res)=>{
	var ids = req.params.ids//comes as array of values seprated ny commas
	var	sql = `UPDATE comments SET status = 'read'
			WHERE id in (${ids})`
	var success = true
    //execute query
    conn.query( sql, (err, comments) =>{
    	if(err){
            console.error(err)
            data = {
                "type":"danger",
                "read": false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else{
            data = {
                "type":"success",
                "read": true
            }
        }
        if (req.xhr || req.accepts('json,html') === 'json') {
            res.send(data)
        }
        else
        {
            res.redirect(303,"/comments")
        }
    })
}
//marking a comment as read and approving it for display on posts
exports.approveComment = (req, res)=>{
	var id = req.params.id
	var sql = `UPDATE comments SET status = 'read', approved = 'approved'
		WHERE id = ${id}`,
	success = true
    //execute query
    conn.query( sql, (err, comments) =>{
    	if(err){
            console.error(err)
            data = {
                "type":"danger",
                "approved": false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else{
            data = {
                "type":"success",
                "approved": true
            }
        }
        if (req.xhr || req.accepts('json,html') === 'json') {
            res.send(data)
        }
        else
        {
            res.redirect(303,"/comments")
        }
    })
}
//markign comments as read and approving in bulk
exports.approveComments = (req, res)=>{
	var ids = req.params.ids // comes as array of values separated by commas
	var	sql = `UPDATE comments SET status = 'read', approved='approved'
			WHERE id in (${ids})`
	var success = true
    //execute query
    conn.query( sql, (err, comments) =>{
    	if(err){
            console.error(err)
            data = {
                "type":"danger",
                "approved": false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else{
            data = {
                "type":"success",
                "approved": true
            }
        }
        if (req.xhr || req.accepts('json,html') === 'json') {
            res.send(data)
        }
        else
        {
            res.redirect(303,"/comments")
        }
    })
}
//marking comment as trash
exports.deleteComment = (req, res) =>{
    let id = req.params.id,
    sql = `DELETE FROM comments
         WHERE id=${id}`,
    success = true
    //execute query
    conn.query( sql, (err, comments) =>{
    	if(err){
            console.error(err)
            data = {
                "type":"danger",
                "deleted": false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else{
            data = {
                "type":"success",
                "deleted": true
            }
        }
        if (req.xhr || req.accepts('json,html') === 'json') {
            res.send(data)
        }
        else
        {
            res.redirect(303,"/comments")
        }
    })
}
//marking comment as trash
exports.deleteComments = (req, res) =>{
    let ids = req.params.ids, //comes as an array of ids seperated by commas
    sql = `DELETE FROM comments
         WHERE id in (${ids})`,
    success = true
    //execute query
    conn.query( sql, (err, comments) =>{
    	if(err){
            console.error(err)
            data = {
                "type":"danger",
                "deleted": false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
        }
        else{
            data = {
                "type":"success",
                "deleted": true
            }
        }
        if (req.xhr || req.accepts('json,html') === 'json') {
            res.send(data)
        }
        else
        {
            res.redirect(303,"/comments")
        }
    })
}

exports.getUnreadComments = (sql, count = false)=>{
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