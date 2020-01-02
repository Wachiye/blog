const hash = require("./hash")
const IMG_DIR = __dirname + "/../public/img/users/"
const posts = require('./posts')
//get profile
exports.getProfile = async(req, res) => {
	//get email from global variable
	let email = info.user.email
	let sql = `SELECT * FROM users WHERE email like '${email}'`;
	
	conn.query(sql, async(err, data) =>{
			
		let user = data[0]

		//check user type
		if(user.category == "Administrator"){
			res.render("admin-profile", {info, user})
		}
		else{
			res.render("profile", {info , user})
		}
	})

}
//view all users
exports.allUsers = (req, res) => {
	let sql = "SELECT * FROM users"

	conn.query(sql, (err, data) =>{
		let users = data
		res.render("users", {info, users})
	})

}

exports.editAdminProfile = (req, res)=>{
	var email = info.user.email,
		id = info.user.id,
		fullname = req.body.fullname
		image = req.files.image

		if(fullname == undefined){
			res.redirect(301, "/profile")
		}
		else{
			conn.query(`UPDATE users SET fullname ='${fullname}' WHERE email ='${email}'`, (err, data)=>{
				
				if( image != undefined){
					image.mv(IMG_DIR + `${id}.jpg`, (err)=>{
						conn.query(`UPDATE users SET image='${id}.jpg' WHERE email ='${email}'`, (err, data)=>{
							
						})
					})
				}
				
				res.redirect(301, "/profile")
			})
		}
}
//edit profile
exports.editProfile = (req, res) => {
	// retrieve email
	var email = info.user.email
	var id = info.user.id

	//validate inputs
	if(req.body.username == undefined || req.body.fullname == undefined || req.body.website == undefined){
		errors = "Some field are empty"
	}
	else{

		let username = req.body.username,
				fullname = req.body.fullname,
				website = req.body.website
				image = req.files.image

		let sql = `UPDATE users set username ='${username}', fullname = '${fullname}', website ='${website}'`
		
		if(image == undefined){
			 sql = sql + ` WHERE email like '${email}'`

			 conn.query( sql , (err, result)=>{
				
				res.redirect(301, "/profile")

			})
		}
		else{
			
			var with_image = sql + `, image = '${id}.jpg' WHERE email like '${email}'`

			image.mv(IMG_DIR +`${id}.jpg`, (err) => {
		        
					conn.query( with_image , (err, result)=>{
						
						res.redirect(301, "/profile")
						
					})
				
			})
		}
		
	}
	
}

//change password
exports.changePassword = async (req, res) =>{
	//check if passwords fields match
	let newPassword = req.body.new_password
	let conPassword = req.body.confirm_password
	if(newPassword == conPassword){
		//get old password
		let oldPassword = req.body.password

		//compare old passsword to password supplied
		let validUser = await hash.validUser(oldPassword, info.user.password)
		//if passwords match, set password to new password
		if( validUser){
			//hash the new password
			newPassword = await hash.hashPassword(newPassword)
			let sql = `UPDATE users SET password='${newPassword}' WHERE username ='${info.user.username}'`
			//execute query
			conn.query( sql, (err, data) =>{
				//if error occurs, diplay error message
				if(err){
					res.redirect(301,"/profile")
				}
				else{ // else diplay a success message
					info.user.password = newPassword
					res.redirect(301,"/profile")
				}
			})
		}
	}

}

//delete User
exports.deleteProfile = (req, res) => {
	let id = info.user.id 
	let sql = `DELETE FROM users WHERE id = ${id}`
	conn.query( sql, (err, data)=>{
		
			info.user = []
			info.loggedIn = false
			res.redirect(301,'/')
	})
}

//change priviledge
exports.changePriviledge = (req, res) =>{
	let id = req.params.id
	let role = req.body.role
	let new_role = req.body.new_role

	if(new_role != undefined){
		let sql = `UPDATE users SET category ='${new_role}' WHERE id = ${id}`
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