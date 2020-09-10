exports.getTeams = async()=>{
	return new Promise( async resolve=>{
		let sql = `SELECT teams.*, fullname AS admin, count(members.id) AS members
				FROM teams
				LEFT join members
				ON members.team_name = teams.name 
				WHERE members.role = 'Admin'`
		conn.query(sql, (err, teams)=>{
			if(err){
				console.error(err)
				teams = []
				data = {
					"type":"danger",
					"teams":[],
					"message":{
						"type":"DB_ERR",
						"ERR":err.message
					}
				}
			}
			else{
				data = {
					"type":"success",
					"teams":teams
				}
			}
			resolve(data)
		})
	})
}
exports.serveTeamsPage = async(req, res)=>{
	let teams = await this.getTeams()
	req.session.page = 'Teams'
	if(req.xhr || req.accepts('json,html') === 'json'){
		res.send(teams)
	}
	else
	{
		teams = teams.teams
		res.render('admin/teams', {info, req,  teams})
	}
}
exports.addTeam = (req, res)=>{
	let name = conn.escape(req.body.name),
		description = conn.escape(req.body.description),
		hiring = conn.escape(req.body.hiring),
		data = {
			"type":"success",
			"message":"New team added."
		},
		sql = `INSERT INTO teams(name, description, hiring)
				VALUES(${name},${description},${hiring})`
	conn.query(sql, (err, team)=>{
		if(err){
			data = {
				"type":"danger",
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
			console.error(err)
		}
		else{
			data = {
				"type":"success",
				"saved": true,
				"team":team
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/teams')
		}
	})
}
exports.editTeam = (req, res)=>{
	let name = req.body.name,
		description = conn.escape(req.body.description),
		hiring = conn.escape(req.body.hiring)
	let data = {
		"type":"success",
		"message":"Successfully updated."
	}
	let sql = `UPDATE teams SET description = ${description}, hiring = ${hiring} WHERE name= '${name}'`
	conn.query(sql, (err, settings)=>{
		if(err){
			console.log(err)
			data = {
				"type":"danger",
				"message":"Error updating settings. Try again later."
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/teams')
		}
	})
}

exports.deleteTeam = (req, res)=>{
	let id = req.params.id,
		sql = 	`DELETE FROM teams WHERE id = ${id}`,
		data = {
			"type":"success",
			"message":"Successfully Deleted."
		}
	conn.query(sql, (err, teams)=>{
		if(err){
			console.log(err)
			data = {
				"type":"danger",
				"message": err.message
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/teams')
		}
	})
}