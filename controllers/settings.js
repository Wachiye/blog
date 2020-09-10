// image upload directory
IMG_DIR = __dirname +"/../public/img/"

exports.getSettings = async()=>{
	return new Promise( async resolve=>{
		var settings_data = [], media_names = [], media_links = []
		let sql = "SELECT * FROM settings"
		conn.query(sql, async(err, settings)=>{
			if(err){
				console.error(err)
				data = {
					"type":"danger",
					"settings": info,
					"message":{
						"type":"DB_ERR",
						"ERR":err.message
					}
				}
			}
			else
			{
				if(settings.length == 0){
					data = {
						"type":"success",
						"settings":[],
						"message":{
							"type":"NULL_SETTINGS",
							"ERR":"Settings not updated. Default values are being used"
						}
					}
				}
				else{
					//parse setting into json
					settings.forEach( function async(setting) {
						setting.content = (JSON.parse(setting.content))
						settings_data[setting.setting] = setting.content
						// create an array list if media accounts exists
						//each media results into name and link attribute
						if(setting.setting == 'media'){
							settings_data[setting.setting] = []
							media_links = Object.values(setting.content)
							media_names = Object.keys(setting.content)
							let tempData = []
							for (var i = 0 ; i < media_names.length;i++) {
								tempData = {
									"name": media_names[i],
									"link": media_links[i]
								}
								settings_data[setting.setting].push(tempData)
							}
						}
					})
					data = {
						"type":"success",
						"settings":settings_data
					}
				}
			}
			resolve(data)
		})
	})
}
//get site settings
exports.serveSettingsPage = async (req, res) =>{
	req.session.page = 'Settings'
	settings = await this.getSettings()
	if(req.xhr || req.accepts('json,html') === 'json'){
		res.send(settings)
	}else{
		settings = settings.settings
		res.render("admin/settings",{info, settings, req})
	}
}


//saving site settings: basics
exports.setBasics = async(req, res) =>{
	let title = req.body.title,
		subtitle = req.body.subtitle,
		description = req.body.description,
		exists = await checkSettings('basic'),
		sql = ''
		//define the insert sql
	let insert_sql = `INSERT INTO settings(setting, content)
	VALUES('basic',JSON_OBJECT("title",?,"subtitle",?,"description",?))`
	//define the update sql
	let update_sql = `UPDATE settings SET content = 
					JSON_SET(content,'$.title',?,'$.subtitle',?,'$.description',?) WHERE setting = 'basic'`
	//check if there are basic settings or not. 
	//if there exists, then update
	exists ? sql = update_sql : sql = insert_sql

	conn.query(sql, [title, subtitle, description], (err, site)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"saved": false,
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}
		else
		{
			data = {
				"type":"danger",
				"saved":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/settings')
		}
	})
}
//saving site settings: basics
exports.setFavicon = async(req, res) =>{
	let image = req.files.image,
		image_url = ''
	
	let sql = `UPDATE settings SET content = 
					JSON_SET(content,'$.favicon',?) WHERE setting = 'basic'`
	
	//save image
	image.mv(IMG_DIR + 'favicon.ico', (err) => {
        if( err){
            data = {
                "type":"danger",
                "message":{
                    "type":"IMG_UPLOAD_ERR",
                    "ERR": err.message 
                }
            }  
        }
    })
	conn.query(sql, 'favicon.ico', (err, site)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"saved": false,
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}
		else
		{
			data = {
				"type":"danger",
				"saved":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/settings')
		}
	})
}
//saving site settings: contacts
exports.setContacts = async(req, res) =>{
	let email = req.body.email,
		phone = req.body.phone,
		exists = await checkSettings('contacts'),
		sql = ''
		//define the insert sql
	let insert_sql = `INSERT INTO settings(setting, content)
	VALUES('contacts',JSON_OBJECT("email",?,"phone",?))`
	//define the update sql
	let update_sql = `UPDATE settings SET content = 
					JSON_SET(content,'$.email',?,'$.phone',?) WHERE setting = 'contacts'`
	//check if there are basic settings or not. 
	//if there exists, then update
	exists ? sql = update_sql : sql = insert_sql

	conn.query(sql, [email, phone], (err, site)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"saved": false,
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}
		else
		{
			data = {
				"type":"danger",
				"saved":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/settings')
		}
	})
}
//saving site settings: media
exports.setMedia = async(req, res) =>{
	let media_name = req.body.medianame,
		media_link = req.body.medialink,
		exists = await checkSettings('media'),
		sql = '',
		values = []
		//define the insert sql
	let insert_sql = `INSERT INTO settings(setting, content)
	VALUES('media',JSON_OBJECT(?,?))`
	//define the update sql
	let update_sql = `UPDATE settings SET content = 
					JSON_SET(content,'$.${media_name}',?) WHERE setting = 'media'`
	//check if there are basic settings or not. 
	//if there exists, then update
	if(exists){
		sql = update_sql
		values = [media_link]
	}
	else{
	 	sql = insert_sql
	 	values = [ media_name, media_link]
	 }

	conn.query(sql, values, (err, site)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"saved": false,
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}
		else
		{
			data = {
				"type":"danger",
				"saved":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/settings')
		}
	})
}
exports.deleteMedia = (req, res)=>{
	let media = req.params.media
	let sql = `UPDATE settings SET content = JSON_REMOVE(content,'$.${media}') WHERE setting = 'media'`
	conn.query(sql, (err, results)=>{
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
		else
		{
			data = {
				"type":"danger",
				"deleted":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/settings')
		}
	})
}

//save services description text
exports.setServicesDescription  = async(req, res)=>{
	let description = req.body.description,
		exists = await checkSettings('basic'),
		sql = ''
		//define the insert sql
	let insert_sql = `INSERT INTO settings(setting, content)
	VALUES('basic',JSON_OBJECT("services_description",?))`
	//define the update sql
	let update_sql = `UPDATE settings SET content = 
					JSON_SET(content,'$.services_description',?) WHERE setting = 'basic'`
	//check if there are basic settings or not. 
	//if there exists, then update
	exists ? sql = update_sql : sql = insert_sql

	conn.query(sql, [description], (err, site)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"saved": false,
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
				"saved":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/settings')
		}
	})
}
//save mission statement text
exports.setMissionStatement  = async(req, res)=>{
	let mission = req.body.mission,
		exists = await checkSettings('basic'),
		sql = ''
		//define the insert sql
	let insert_sql = `INSERT INTO settings(setting, content)
	VALUES('basic',JSON_OBJECT("mission",?))`
	//define the update sql
	let update_sql = `UPDATE settings SET content = 
					JSON_SET(content,'$.mission',?) WHERE setting = 'basic'`
	//check if there are basic settings or not. 
	//if there exists, then update
	exists ? sql = update_sql : sql = insert_sql

	conn.query(sql, [mission], (err, site)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"saved": false,
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
				"saved":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/settings')
		}
	})
}
//save mission statement text
exports.setTeamsDescription  = async(req, res)=>{
	let description = req.body.teams_description,
		exists = await checkSettings('basic'),
		sql = ''
		//define the insert sql
	let insert_sql = `INSERT INTO settings(setting, content)
	VALUES('basic',JSON_OBJECT("teams_description",?))`
	//define the update sql
	let update_sql = `UPDATE settings SET content = 
					JSON_SET(content,'$.teams_description',?) WHERE setting = 'basic'`
	//check if there are basic settings or not. 
	//if there exists, then update
	exists ? sql = update_sql : sql = insert_sql

	conn.query(sql, [description], (err, site)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"saved": false,
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
				"saved":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else{
			res.redirect(303, '/settings')
		}
	})
}
//checks if a particular setting exist
//returns true if exists
var checkSettings = (name)=>{
	return new Promise( async resolve =>{
		conn.query(`SELECT setting from settings WHERE setting ='${name}'`, (err, results)=>{
			if(results.length == 0 || err){
				resolve(false)
			}
			else{
				resolve(true)
			}
		})
		
	})
}