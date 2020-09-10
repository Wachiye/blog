const hash = require("./hash")
const IMG_DIR = __dirname + "/../public/img/users/"
const posts = require('./posts')
const comments = require('./comments')

exports.serveProfilePage = async(req, res) => {
	req.session.page = 'Profile'
	//get email from global variable
	let email = req.session.user.email
	let sql = `SELECT * FROM users WHERE email like '${email}' `;
	
	conn.query(sql, async(err, profile) =>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"profile":[],
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
				"profile":profile[0]
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else
		{
			res.render("admin/profile", {info, req, profile:profile[0]})
		}
	})
}
//edit profile
exports.editProfile = (req, res) => {
	var email = req.session.user.email
	var id = req.session.user.id
	var data = []
	let fullname = conn.escape(req.body.fullname),
		website = conn.escape(req.body.website)

	let sql = `UPDATE users SET fullname = ${fullname}, website =${website}`
		sql = sql + ` WHERE email ='${email}'`

	conn.query( sql , (err, result)=>{
		if(err){
			data = {
				"type":"danger",
				"updated":false,
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}
		else
		{
			req.session.user.fullname = req.body.fullname
	 		req.session.user.website = req.body.website
			data = {
				"type":"success",
				"updated":true
			}
		}

		if(req.xhr || req.accepts('json,html')==='json')
		{
			res.send(data)
		}
		else
		{
			res.redirect(303, '/profile')
		}
	})
	
}
exports.changeImage = (req, res)=>{
	res.setHeader('Content-Type', 'application/json')
	let image = req.files.image,
		id = req.session.user.id
		sql = `UPDATE users SET image='${id}.jpg' WHERE id =${id}`
	image.mv(IMG_DIR + `${id}.jpg`,(err)=>{
		conn.query(sql, (err, data)=>{
			if(err){
				console.error(err)
				data = {
					"type":"danger",
					"updated":false,
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
					"updated":true
				}
			}
			if(req.xhr || req.accepts('json,html') ==='json'){
				res.send(data)
			}
			else
			{
				res.redirect(303, '/profile')
			}		
		})	
	})
}

//change password
exports.changePassword = async (req, res) =>{
	var email = req.session.user.email
	var oldPassword = req.body.password
	var new_password = req.body.new_password
	var valid = await hash.validUser( oldPassword, req.session.user.password)
	var data = []

	if(valid){
		newPassword = await hash.hashPassword(new_password)

		let sql = `UPDATE users SET password ='${newPassword}'`
			sql = sql + ` WHERE email ='${email}'`

		conn.query( sql ,async (err, result)=>{
			if(err){
				console.error(err)
				data = {
					"type":"danger",
					"updated":false,
					"message":{
						"type":"DB_ERR",
						"ERR":err.message
					}
				}
			}
			else{
				data ={
					"type":"success",
					"updated":true
				}
			}
		})
	}
	else
	{
		data = {
			"type":"danger",
			"updated":false,
			"message":{
				"type":"PWD_ERR",
				"ERR":"Old Passwords don't match"
			}
		}
	}
	if(req.xhr || req.accepts('json,html')==='json')
	{
		res.send(data)
	}
	else
	{
		res.redirect(303, '/profile')
	}
}

//delete profile
exports.deleteProfile = (req, res) => {
	let id = req.session.user.id 
	let sql = `DELETE FROM users WHERE id = ${id}`
	conn.query( sql, (err, user)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"deleted":false,
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
				"deleted":true
			}
		}
		if(req.xhr || req.accepts('json,html') ==='json'){
			res.send(data)
		}
		else
		{
			res.redirect(303,'/logout')
		}		
	})
}
//change priviledge
exports.changePriviledge = (req, res) =>{
	let id = req.params.id
	let role = req.body.role
	let new_role = conn.escape(req.body.new_role)

	if(new_role != undefined){
		let sql = `UPDATE users SET category =${new_role} WHERE id = ${id}`
		conn.query( sql, (err, result)=>{
			res.redirect(301, "/users")
		})
	}
	
}
//view all users
exports.serveUsersPage = (req, res) => {
	req.session.page = 'Users'
	let sql = `SELECT * FROM users WHERE category = 'user'`
	conn.query(sql, (err, users)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"users":[],
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}
		else{
			data = {
				"type":"success",
				"users":users
			}
		}
		if(req.xhr || req.accepts('json,html') ==='json'){
			res.send(data)
		}
		else{
			res.render("admin/users",{info, req, users})
		}
	})
}

//view all ADMINS
exports.serveAdminsPage = (req, res) => {
	req.session.page = 'Admins'
	let sql = `SELECT * FROM users WHERE category = 'Administrator'`
	conn.query(sql, (err, admins)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"admins":[],
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}
		else{
			data = {
				"type":"success",
				"admins":admins
			}
		}
		if(req.xhr || req.accepts('json,html') ==='json'){
			res.send(data)
		}
		else{
			//serves the users page but sets users to adimns returned
			res.render("admin/users",{info, req, users:admins})
		}
	})
}
//delete user
exports.deleteUser = (req, res)=>{
	let id = req.params.id
	let sql = `DELETE FROM users WHERE id =${id}`
	conn.query( sql, (err, user)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"deleted":false,
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
				"deleted":true
			}
		}
		if(req.xhr || req.accepts('json,html') ==='json'){
			res.send(data)
		}
		else
		{
			res.redirect(303,'/users')
		}
	})
}
//delete user
exports.deleteUsers = (req, res)=>{
	let ids = req.params.ids
	let sql = `DELETE FROM users WHERE id in (${ids})`
	conn.query( sql, (err, user)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"deleted":false,
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
				"deleted":true
			}
		}
		if(req.xhr || req.accepts('json,html') ==='json'){
			res.send(data)
		}
		else
		{
			res.redirect(303,'/users')
		}
	})
}