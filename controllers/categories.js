exports.serveCategoriesPage = (req, res)=>{
	req.session.page = 'Categories'
	let sql  = "SELECT name, description, tags FROM categories"
	conn.query(sql, (err, categories)=>{
		if(err){
    		console.error(err)
    		data = {
                "type":"danger",
                "categories": [],
                "message":{
                    "type":"DB_ERR",
                    "ERR":err.message
                }
            }
    	}
        else{
            data = {
                "type":"success",
                "categories": categories
            }
        }
    	if (req.xhr || req.accepts('json,html') === 'json') {
    		res.send(data)
    	}
    	else
        {
       		res.render("admin/categories", {info, req, categories})
       	}
	})
}

exports.getCategories = ()=>{
	return new Promise( resolve=>{
		conn.query('SELECT id, name, tags FROM categories', (err, categories)=>{
			if(err){
				resolve([])
			}
			else{
				resolve(categories)
			}
		})
	})
}
exports.addCategory= (req, res)=>{
	let name = conn.escape(req.body.name),
		description = conn.escape(req.body.description),
		tags = req.body.tags

	let sql  = `INSERT INTO categories(name, description, tags) VALUES(${name}, ${description}, '${tags}')`
	
	conn.query(sql, (err, category)=>{
		if(err){
			console.error(err)
			data = {
				"type":"danger",
				"saved":false,
				"message":{
					"type":"DB_ERR",
					"ERR":err.message
				}
			}
		}else{
			data = {
				"type":"success",
				"saved":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else
		{
			res.redirect(303,"/categories")
		}
	})
}

exports.removeCategory = (req, res)=>{
	let id = req.params.id
	let sql  = `DELETE FROM categories WHERE id = ${id}`
	conn.query(sql, (err, data)=>{
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
		}else{
			data = {
				"type":"success",
				"deleted":true
			}
		}
		if(req.xhr || req.accepts('json,html') === 'json'){
			res.send(data)
		}
		else
		{
			res.redirect(303,"/categories")
		}
	})
}