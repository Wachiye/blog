exports.categories = (req, res)=>{
	let sql  = "SELECT * FROM categories"
	conn.query(sql, (err, data)=>{
		let categories = data
		res.render("categories", {info, all, categories})
	})
}

exports.getCategories = ()=>{
	let sql  = "SELECT * FROM categories"
	conn.query(sql, (err, data)=>{
		if(err){
			return []
		}
		else{
			return data
		}
	})
}
exports.addCategory= (req, res)=>{
	let name = req.body.name
	let sql  = `INSERT INTO categories(name) VALUES('${name}')`
	conn.query(sql, (err, data)=>{
		res.redirect(301,"/categories")
	})
}

exports.removeCategory = (req, res)=>{
	let id = req.params.id
	let sql  = `DELETE FROM categories WHERE id = ${id}`
	conn.query(sql, (err, data)=>{
		res.redirect(301,"/categories")
	})
}