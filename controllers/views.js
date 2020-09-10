exports.addView = (req, res)=> {
	let id = req.body.id,
		type = req.body.type,
		name = req.body.name,
		sql = ""

	if (type == "page") {
		sql = `UPDATE siteviews SET views = (siteviews.views + 1) WHERE name = '${name}'`
	}
	else{
		sql = `UPDATE posts SET views = posts.views + 1 WHERE id = '${id}'`
	}
		
	conn.query(sql, (err, views)=>{
		if(err)
			console.log(err)
	})
}

var stats = (sql)=>{
	return new Promise( async resolve=>{
		conn.query(sql, (err, statistics)=>{
			if(err){
				resolve([])
			}
			else{
				resolve(statistics)
			}
		})
	})
}

exports.getStats = async()=>{
	return new Promise( async resolve=>{
		let audience = await stats("SELECT count(id) as audience from users where category = 'Subscriber'"),
			posts = await stats("SELECT count(id) as posts from posts"),
			comments = await stats("SELECT count(id) as comments from comments"),
			page_stats = await stats("SELECT name, views as value from siteviews"),
			site_views = await stats("SELECT SUM(views) as views from siteviews"),
			post_stats = await stats("SELECT SUM(views) as views, SUM(comments) AS comments from posts"),
			unreadComments = await stats("SELECT count(id) comments from comments WHERE status = 'unread'"),
			newContacts = await stats("SELECT count(id) as contacts from contacts order by date desc limit 10"),
			subscribers = await stats("SELECT * FROM users WHERE category = 'Subscriber' order by dateCreated desc limit 10"),
			recentPosts = await stats("SELECT id, title, dateCreated FROM posts order by dateCreated desc limit 7 "),
			teams = await stats("SELECT count(id) as teams from teams"),
			members = await stats("SELECT count(id)  as members from members")
			// sessionExpiry = req.session.cookie._expires
			
		let quickStats = {
			"audience": audience[0].audience,
			"posts" : posts[0].posts,
			"comments" : comments[0].comments,
			"views" : site_views[0].views + post_stats[0].views
		},
		pageStats = page_stats,
		postStats = {
			"posts" : posts[0].posts,
			"views" : post_stats[0].views,
			"comments" : post_stats[0].comments
		}
		teams = teams[0].teams
		members = members[0].members
		comments = unreadComments[0].comments
		contacts = newContacts[0].contacts
		data = {
			"teams": teams,
			"members": members,
			"comments":comments,
			"contacts": contacts,
			"subscribers": subscribers,
			"quickStats": quickStats,
			"pageStats":pageStats,
			"postStats":postStats,
			"recentPosts": recentPosts
		}
		resolve(data)
	})
}

exports.serveDashboard = async(req, res)=>{
	req.session.page = 'Dashboard'
	let statistics = await this.getStats()
	if( req.xhr || req.accepts('json.html') === 'json'){
		res.send(statistics)
	}else{
		res.render("admin/dashboard", {info, req, statistics})
	}
}