//returns a json object of services
exports.getServices = async()=>{
	return new Promise( async resolve=>{
		let sql = `SELECT * FROM services`, data = []
		//execute query
		conn.query(sql, async(err, services)=>{
			//on error
			if(err){
				data = {
					"type":"danger",
					"services":[],
					"message":{
						"type":"DB_ERR",
						"ERR": err.message
					}
				}
			}
			else{ //on success
				data = {
					"type":"success",
					"services":services
				}
			}
			resolve(data)
		})
	})
}
//display services page
exports.serveServicesPage = async(req, res)=>{
	req.session.page = 'Services'
	services = await this.getServices()
	if(req.xhr || req.accepts('json,html') === 'json'){
        res.send(services)
    }
    else{
        services = services.services
        res.render("admin/services", {info, req, services})
    }
}

//saving a service
exports.addService = (req, res)=>{
	//get data suplied
	let name = req.body.name,
		description = req.body.description,
		image = req.files.image,
		level = req.body.level

	let sql = `INSERT INTO services (name, description,level, image)
			VALUES(?,?,?,?)`
	image.mv( IMG_DIR + `${name}.jpg`, (err)=>{
		if(err){
			data = {
				"type":"danger",
				"message":{
					"type":"IMG_ERR",
					"ERR":err.message
				}
			}
		}
		else{
			image = name+'.jpg'
			//execute query
			conn.query(sql,[name, description, level, image], (err, service)=>{
				//on error
				if(err){
					data = {
						"type":"danger",
						"saved":false,
						"message":{
							"type":"DB_ERR",
							"ERR": err.message
						}
					}
				}
				else{ //on success
					data = {
						"type":"success",
						"saved": true,
						"service":service
					}
				}
				//determine req type and respond accordingly
				if(req.xhr || req.accepts('json,html') === 'json'){ //ajax request
					res.send(data)
				}else{
					//normal request: redirect to services page
					res.redirect(303, '/services')
				}
			})
		}
	})
}
//deletes a service 
exports.deleteService = (req, res)=>{
	//get the id
	let ID = req.params.id
	let sql = `DELETE FROM services WHERE id = ?`
		//execute query
		conn.query(sql,id, async(err, services)=>{
			//on error
			if(err){
				data = {
					"type":"danger",
					"deleted": false,
					"message":{
						"type":"DB_ERR",
						"ERR": err.message
					}
				}
			}
			else{ //on success
				data = {
					"type":"success",
					"deleted": true,
					"services": services
				}
			}
			res.redirect(303, '/services')
		})
}