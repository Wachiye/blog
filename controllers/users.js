const hash = require("./hash")
const IMG_DIR = __dirname + "/../public/img/users/"
const posts = require('./posts')
const comments = require('./comments')

//get profile
exports.getProfile = async(req, res) => {
	//get email from global variable
	let email = req.session.user.email
	let sql = `SELECT * FROM users WHERE email like '${email}' `;
	
	conn.query(sql, async(err, data) =>{
		
		let layout = "layout"
		let profile = data[0]
		//get user comments
		let myComments = await comments.myComments(req, res)
		//get user posts
		let myPosts = await posts.getAll(`SELECT id, title, image FROM posts WHERE author = '${req.session.user.username}'`)
		if(req.session.type == "admin"){
			layout = "admin/layout"
		}
		res.render("profile", {info, layout, req, unreadComments, profile, myComments, myPosts})
	})

}
//view all users
exports.allUsers = (sql) => {
	return new Promise( resolve => {
		conn.query(sql, (err, data) =>{
			resolve(data)
		})
	})
}

exports.changeImage = (req, res)=>{
	let image = req.files.image,
		id = req.session.user.id
		sql = `UPDATE users SET image='${id}.jpg' WHERE id =${id}`
	image.mv(IMG_DIR + `${id}.jpg`,(err)=>{
		conn.query(sql, (err, data)=>{
			if(!err){
				req.session.user.image = `${id}.jpg`
			}
			else{
				console.log(err)
			}
		})
		res.redirect(301, '/profile')
	})	
}

//edit profile
exports.editProfile = (req, res) => {
	// retrieve email
	var email = req.session.user.email
	var id = req.session.user.id

	//validate inputs
	if(req.body.fullname == undefined || req.body.website == undefined){
		errors = "Some field are empty"
		console.log(req)
	}
	else
	{

		let fullname = conn.escape(req.body.fullname),
				website = conn.escape(req.body.website)

		let sql = `UPDATE users SET fullname = ${fullname}, website =${website}`
			sql = sql + ` WHERE email ='${email}'`

		 conn.query( sql , (err, result)=>{
		 	req.session.user.fullname = req.body.fullname
		 	req.session.user.website = req.body.website
			res.redirect(301, "/profile")
		})
	}
	
}

//change password
exports.changePassword = async (req, res) =>{
	//check if passwords fields match
	let newPassword = req.body.new_password,
		conPassword = req.body.confirm_password

	if(newPassword == conPassword){
		//get old password
		console.log(newPassword)
		let oldPassword = req.body.password

		//compare old passsword to password supplied
		let validUser = await hash.validUser(oldPassword, req.session.user.password)
		//if passwords match, set password to new password
		if( validUser){
			//hash the new password
			newPassword = await hash.hashPassword(newPassword)
			let sql = `UPDATE users SET password='${newPassword}' WHERE email ='${req.session.user.email}'`
			//execute query
			conn.query( sql, (err, data) =>{
				//if error occurs, diplay error message
				if(err){
					res.redirect(301,"/profile")
					console.log(err)
				}
				else{ // else diplay a success message
					req.session.user.password = newPassword
					console.log(data)
					res.redirect(301,"/profile")
				}
			})
		}
		else{
			res.send("Passwords dont match")
		}
	}

}

//delete User
exports.deleteProfile = (req, res) => {
	let id = req.session.user.id 
	let sql = `DELETE FROM users WHERE id = ${id}`
	conn.query( sql, (err, data)=>{
		
			req.session.user = null
			req.session.loggedIn = false
			res.redirect(301,'/logout')
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

//delete user
exports.deleteUser = (req, res)=>{
	let id = req.params.id
	let sql = `DELETE FROM users WHERE id =${id}`
	conn.query( sql, (err, result)=>{
			res.redirect(301,"/users")
	})
}