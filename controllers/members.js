const IMG_DIR = __dirname + "/../public/img/users/"

exports.getMembers = (req, res) =>{
	let sql = "SELECT * FROM members"
	conn.query(sql, (err, members)=>{
		if(req.session.type=="admin"){
			res.render("admin/members", {info, req, members})
		}
		else
		{
			res.render("members", {info, req, members})
		}
		
	})
}

exports.addMember = (req, res) =>{
	let id = req.body.id,
		fullname = conn.escape(req.body.fullname),
		email = conn.escape(req.body.email),
		phone = conn.escape(req.body.phone),
		specs = req.body.specs,
		langs = req.body.langs,
		image = req.files.image

	let sql = `INSERT INTO members(id,fullname,email,phone,specialization,languages,image)
		VALUES(${id},${fullname},${email},${phone},'${specs}','${langs}','${id}.jpg')`
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

exports.deleteMember = (req, res) =>{
	let id = req.params.id,
		sql = `DELETE FROM members WHERE id=${id}`
	conn.query(sql, (err, members) =>{
		res.redirect(301, "/members")
	})
}
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