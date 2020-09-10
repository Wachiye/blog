//get all subscribers
exports.getSubscribers = async ()=>{
	return new Promise( async resolve=>{
		let sql = `SELECT * FROM subscribers`
		conn.query(sql, (err, subscribers)=>{
			if(err){
				data={
					"type":"danger",
					"subscribers":[],
					"message":{
						"type":"DB_ERR",
						"ERR":err.message
					}
				}
			}
			else
			{
				if(subscribers.length <= 0){
					data={
					"type":"success",
					"subscribers":[],
					"message":{
						"type":"NULL_DATA",
						"ERR":"You have  0 subscribers."
					}
				}
				}
				data = {
					"type": "success",
					"subscribers":subscribers
				}
			}
			resolve(subscribers)
		})
	})
}

//view all subcribers
exports.serveSubscribersPage = (req, res) => {
	req.session.page = 'Subscribers'
	let sql = `SELECT * FROM subscribers`
	if(req.query.view){
        sql = sql +  `ORDER BY  dateCreated  DESC limit 10`
    }
	conn.query(sql, (err, subscribers)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"subscribers":[],
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}
		else{
			data = {
				"type":"success",
				"subscribers":subscribers
			}
		}
		if(req.xhr || req.accepts('json,html') ==='json'){
			res.send(data)
		}
		else{
			res.render("admin/subscribers",{info, req, subscribers})
		}
	})
}
//normal subscription to the website
exports.subscribe = (req, res) => {
    //get data items
    let username = req.body.username,
        email = req.body.email,
        sql = `INSERT INTO subscribers(username, email) 
        VALUES(?, ?)`,
        data = {
            "type":"success",
           "saved": true
        }
    //pass data items to query and execute
    conn.query(sql,[username, email], (err, subscriber) =>{
        //on error
        if(err){
             data = {
                "type":"danger",
                "saved": false,
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
            console.error(err)
        }
        else
        {
              data = {
                "type":"success",
               "saved": true,
               "subscriber": subscriber
            }   
        }
        if(req.xhr || req.accepts('json,html') === 'json'){
            res.send(data)
        }
        else{
            res.redirect(303, "/")
        }
    })
}
//subscribing to the website during commenting
exports.subscribe_comment = (sql, data = [])=>{
    return new Promise( async resolve=>{
        conn.query(sql, data, (err, subscriber)=>{
            if(err){
                console.error(err)
                resolve([])
            }else{
                resolve(subscriber)
            }
        })
    })
}
//unsubscribing one
exports.unsubscribeOne = (req, res) => {
    let id = req.params.id, //array of comma separated values
        sql = `DELETE FROM subscribers WHERE id = ${id}`,
        data = {
            "type":"success",
            "deleted":true
        }
    conn.query(sql, (err, subscribers) =>{
        if(err){
             data = {
                "type":"danger",
                "deleted": false,
                "message":{
                    "type" :"DB_ERR",
                    "ERR":err.message
                }
            }
            console.error(err)
        }
        else{
          data = {
                "type":"success",
                "subscribers":subscribers,
                "deleted": true
            }  
        }
        if(req.xhr || req.accepts('json,html') === 'json'){
            res.send(data)
        }
        else{
            //check session type  and direct accordingly for normal responses
            if(req.session.loggedIn && req.session.type == 'Administrator'){
                res.redirect(303, '/subscribers')
            }
            else{
                res.redirect(303, "/")
            }
        }
    })
}
//unsubscribing  many
exports.unsubscribeMany = (req, res) => {
    let ids = req.params.ids, //array of comma separated values
        sql = `DELETE FROM subscribers WHERE id in (${ids})`,
        data = {
            "type":"success",
            "deleted":true
        }
    conn.query(sql, (err, subscribers) =>{
        if(err){
             data = {
                "type":"danger",
                "deleted": false,
                "message":{
                    "type" :"DB_ERR",
                    "ERR":err.message
                }
            }
            console.error(err)
        }
        else{
          data = {
                "type":"success",
                "subscribers":subscribers,
                "deleted": true
            }  
        }
        if(req.xhr || req.accepts('json,html') === 'json'){
            res.send(data)
        }
        else{
            //check session type  and direct accordingly for normal responses
            if(req.session.loggedIn && req.session.type == 'Administrator'){
                res.redirect(303, '/subscribers')
            }
            else{
                res.redirect(303, "/")
            }
        }
    })
}