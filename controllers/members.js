const IMG_DIR = __dirname + "/../public/img/users/"

//get members
exports.getMembers = async()=>{
	return new Promise( async resolve=>{
		let sql = `SELECT * from members`
		conn.query(sql, async(err, members)=>{
			if(err){
				console.error(err)
				data = {
					"type":"danger",
					"members":[],
					"message":{
						"type":"DB_ERR",
						"ERR":err.message
					}
				}
			}
			else{
				data = {
					"type":"success",
					"members":members
				}
			}
			resolve(data)
		})
	})
}
//display page to add new member
exports.serveNewMemberPage = async(req, res)=>{
	req.session.page = 'New Member'
	teams = await getAll('SELECT id, name from teams')
	res.render('admin/newMember', {info, req, teams})
}
//return members or display members apage
exports.serveMembersPage = async(req, res)=>{
	req.session.page = 'Members'
	let teams = await getAll('SELECT id, name, description from teams'),
	members = await this.getMembers()
	if(req.xhr || req.accepts('json,html') === 'json'){
		res.send(data)
	}
	else{
		members = members.members
		if(req.session.loggedIn && req.session.type == 'Administrator'){
			console.log(teams)
			res.render("admin/members", {info, req, members, teams})
		}
		else
		{
			req.session.page = 'The Team'
			res.render("members", {info, req, members})
		}
	}
}
//creating or saving a new member
exports.addMember = (req, res) =>{
	let id = req.body.id,
		fullname = conn.escape(req.body.fullname),
		email = conn.escape(req.body.email),
		phone = conn.escape(req.body.phone),
		specs = req.body.specs,
		langs = req.body.langs,
		team = req.body.team,
		team_id = team.split(":")[1],
		team_name = team.split(":")[0],
		role = req.body.role,
		image = req.files.image

	let sql = `INSERT INTO members(id,fullname,email,phone,specialization,languages,team_id,team_name,role,image)
		VALUES(${id},${fullname},${email},${phone},'${specs}','${langs}',${team_id},'${team_name}','${role}', '${id}.jpg')`
	image.mv(IMG_DIR + `${id}.jpg`,(err)=>{
		if(!err) {
			conn.query(sql, (err, members)=>{
				if(!err){
					res.redirect(301, "/members")
				}
				else{
					console.log(err)
					res.end("An error occured. Please go back and try again.")
				}
			})
		} else {
			res.end("An error occured while uploading the image. Please go back and try again.")
		}
	})
}
//editing a single member info
exports.editMember = (req, res) =>{
	let id = req.params.id,
		fullname = conn.escape(req.body.fullname),
		email = conn.escape(req.body.email),
		specs = req.body.specs,
		langs = req.body.languages
	let sql = `UPDATE members SET fullname=${fullname}, email = ${email},
		specialization = ${specs}, languages = ${langs} WHERE id = ${id}`
	conn.query(sql, (err, members) =>{
		res.redirect(301, "/members")
	}) 
}
//changing display image of the member
exports.changeImage = (req, res)=>{
	let image = req.files.image,
		id = req.session.user.id
		sql = `UPDATE users SET image='${id}.jpg' WHERE id =${id}`
	image.mv(IMG_DIR + `${id}.jpg`,(err)=>{
		conn.query(sql, (err, data)=>{
			if(!err){
				req.session.user.image = id +".jpg"
			}
			else{
				console.log(err)
				res.end("An error occured. Please go back and try again.")
			}
		})
		res.redirect(301, '/members')
	})	
}
//deleting a single member
exports.deleteMember = (req, res) =>{
	let id = req.params.id,
		sql = `DELETE FROM members WHERE id=${id}`
	conn.query(sql, (err, members) =>{
		res.redirect(301, "/members")
	})
}
//deleting multiple members
exports.deleteMembers = (req, res) =>{
	let ids = req.params.ids,
		sql = `DELETE FROM members WHERE id in(${ids})`
	conn.query(sql, (err, members) =>{
		res.redirect(301, "/members")
	})
}

var getAll = (sql)=>{
	return new Promise(async resolve=>{
		conn.query(sql, (err, teams)=>{
			if(err){
				console.error(err)
				resolve([])
			}else{
				resolve(teams)
			}
		})
	})
}