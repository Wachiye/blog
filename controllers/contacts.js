//serve contact page
exports.serveContactPage = (req, res)=>{
	req.session.page = 'Contact'
	res.render('contact',{info, req})
}
//create or save a new contact info
exports.saveContact = (req, res)=>{
	let f_name = req.body.firstname,
		l_name = req.body.lastname,
		email = conn.escape(req.body.email),
		message = conn.escape(req.body.message),
		fullname = f_name + " " + l_name

	let sql = `INSERT INTO contacts(fullname, email, message)
		VALUES('${fullname}', ${email}, ${message})`;

	conn.query( sql, (err, contact)=>{
		if(err)
		{
			console.error(err)
			data = {
				"type":"danger",
				"saved":false,
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
				"saved":true,
				"contact":contact
			}
		}
		if(req.xhr || req.accepts('json,html')==='json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/contact')
		}
	})
}
//return contacts or display contacts page
exports.serveContactsPage = (req, res)=>{
	let sql = `SELECT * FROM contacts`
	if(req.query.view){
        sql = sql +  ` WHERE status = 'unread'`
    }
    sql = sql + ` ORDER BY ID DESC`
	conn.query(sql, (err, contacts)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"contacts:":[],
				"message":{
					"type":"BB_ERR",
					"ERR":err.message
				}
			}
		}
		else
		{
			data = {
				"type":"success",
				"contacts":contacts
			}
		}
		if(req.xhr || req.accepts("json, html")==='json'){
			res.send(data)
		}
		else{
			res.render('admin/contacts', { info, req, contacts})
		}
	})
}
//marking a contacts as read
exports.markContactAsRead = (req, res)=>{
	var id = req.params.id
	var sql = `UPDATE contacts SET status = 'read'
		WHERE id = ${id}`,
	success = true
    //execute query
    conn.query( sql, (err, contacts) =>{
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
            console.log(data)
    		res.send(data)
    	}
    	else
        {
       		res.redirect(303,"/contacts")
       	}
    })
}
//marking comments as read in bulk: does not approve comments
exports.markContactsAsRead = (req, res)=>{
	var ids = req.params.ids//comes as array of values seprated ny commas
	var	sql = `UPDATE contacts SET status = 'read'
			WHERE id in (${ids})`
	var success = true
    //execute query
    conn.query( sql, (err, contacts) =>{
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
            res.redirect(303,"/contacts")
        }
    })
}
exports.deleteContact = (req, res)=>{
	let contact_id = req.params.id
	let sql = `DELETE FROM contacts WHERE contacts.id = ${contact_id}`
	conn.query(sql, (err, contact)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"deleted:":false,
				"message":{
					"type":"BB_ERR",
					"ERR":err.message
				}
			}
		}
		else
		{
			data = {
				"type":"success",
				"deleted":true,
				"contact":contact
			}
		}
		if(req.xhr || req.accepts("json, html")==='json'){
			res.send(data)
		}
		else{
			res.render('admin/contacts', { info, req, contacts})
		}
	})	
}
exports.deleteContacts = (req, res)=>{
	let contact_ids = req.params.ids
	let sql = `DELETE FROM contacts WHERE contacts.id in (${contact_ids})`
	conn.query(sql, (err, contacts)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"deleted:":false,
				"message":{
					"type":"BB_ERR",
					"ERR":err.message
				}
			}
		}
		else
		{
			data = {
				"type":"success",
				"deleted":true,
				"contacts":contacts
			}
		}
		if(req.xhr || req.accepts("json, html")==='json'){
			res.send(data)
		}
		else{
			res.render('admin/contacts', { info, req, contacts})
		}
	})	
}