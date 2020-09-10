//return a list of testimonials
exports.getTestimonials = async()=>{
	return new Promise( async resolve=>{
		let sql = `SELECT * FROM testimonials`
		//excute database query
		conn.query(sql, (err, testimonials)=>{
			//on database error
			if(err){
				data = {
					"type":"danger",
					"testimonials":[],
					"message":{
						"type":"DB_ERR",
						"ERR":err.message
					}
				}
			}
			else{
				if(testimonials.length == 0){
					data = {
						"type":"success",
						"testimonials":[],
						"message":{
							"type":"NULL_DATA",
							"ERR":"You have 0 testimonials"
						}
					}
				}
				else{
					data = {
						"type":"success",
						"testimonials":testimonials
					}
				}
			}
			resolve(data)
		})
	})
}
//serves the testimonials page or return an array of testimonials
exports.serveTestimonialsPage = async(req, res)=>{
	req.session.page = "Testimonials"
	let testimonials = await this.getTestimonials()
	if(req.xhr || req.accepts('json,html') === 'json'){
		res.send(testimonials)
	}
	else
	{
		testimonials = testimonials.testimonials
		//check if user if loggedin and is admin
		if(req.session.loggedIn && req.session.type == 'Administrator')
            res.render("admin/testimonials", {info, req, testimonials})
        else
            res.render("testimonials", {info, req, testimonials})
		
	}
}

//adding a new testimonials
exports.addTestimonial = (req, res)=>{
	// get body data
	let name = req.body.name,
		email = req.body.email,
		job = req.body.job || '',
		company = req.body.company || '',
		testimony = req.body.testimony
	//define sql
	let sql = `INSERT INTO testimonials(name, email, job, company, testimony)
		VALUES(?,?,?,?,?)`

	//execute query
	conn.query( sql ,[ name, email, job, company, testimony], (err, testimonial)=>{
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
		}
		else{
			data = {
				"type":"success",
				"saved": true,
				"testimonial": testimonial
			}
			if(req.xhr || req.accepts('json,html') === 'json'){
				res.send(data)
			}
			else{
				res.redirect(303, '/testimonials')
			}
		}
	})

}
//updating a testimonial and publishing for viewing
exports.approveTestimonial = (req, res)=>{
	//get id param and testimony
	let id = req.params.id,
		testimony = req.body.testimony

	let sql = `UPDATE testimonials SET testimony = ?, status = 1 WHERE id = ?`
	conn.query(sql,[id, testimony], (err, testimonial)=>{
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
		}
		else{
			data = {
				"type":"success",
				"saved": true,
				"testimonial": testimonial
			}
			if(req.xhr || req.accepts('json,html') === 'json'){
				res.send(data)
			}
			else{
				res.redirect(303, '/testimonials')
			}
		}
	})
}
//delete a testimonial
exports.deleteTestimonial = (req, res)=>{

	let id = req.params.id,// testimonial id to delete
		sql = 'DELETE FROM testimonials WHERE id = ?'
	//query execution
	conn.query( sql, id, (err, testimonial)=>{
		if(err){
			data = {
				"type":"danger",
				"deleted": false,
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}else
		{
			data = {
				"type":"success",
				"deleted": true,
				"testimonial":testimonial
			}
			if(req.xhr || req.accepts('json,html') === 'json'){
				res.send(testimonial)
			}
			else
			{
				// redirect to testimonials page
				res.redirect(303, "/testimonials")	
			}
		}
	})
}