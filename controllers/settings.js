//get site settings
exports.getSettings = () =>{
	return new Promise(resolve =>{
		let sql = "SELECT * FROM settings limit 1"
		conn.query(sql, (err, site)=>{
			if(err || site.length == 0){
				resolve(info)
			}
			else
			{
				info.facebook = site[0].facebook
				info.twitter = site[0].twitter
				info.github = site[0].github
				info.title = site[0].title
				info.subtitle = site[0].sub_title
				info.email = site[0].email
				resolve(info)
			}
		})	
	})
	
}

//updating site settings
exports.setSettings = (req, res) =>{
	let title = conn.escape(req.body.title),
		subtitle = conn.escape(req.body.sub_title),
		email = conn.escape(req.body.email),
		fb = conn.escape(req.body.facebook),
		git = conn.escape(req.body.github),
		twitter = conn.escape(req.body.twitter)

	let sql = `UPDATE settings SET title = ${title}, sub_title = ${subtitle}, email=${email}, facebook = ${fb}, twitter = ${twitter}, github = ${git} `
	conn.query(sql, (err, site)=>{
		if(err){
			console.log(err)
			res.redirect(301,"/settings")
		}
		else{
			info.facebook = req.body.facebook
			info.twitter = req.body.twitter
			info.github = req.body.github
			info.title = req.body.title
			info.subtitle = req.body.sub_title
			res.redirect( 301, "/settings")
		}
	})
}