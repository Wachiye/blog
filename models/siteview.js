var mongoose = require('mongoose');

var Schema = mongoose.Schema

var siteviewSchema = new Schema({
	id:{
		type: Schema.Types.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name:{ 
		type: String,
		allowNull: false
	},
	views:{ 
		type: Schema.Types.INTEGER,
		default: 0
	}
})

var siteviewCollection = 'siteviews'

var Siteview = mongoose.model('Siteview', siteviewSchema, siteviewCollection)
//this values are for page routes eg about is for the about page route
//required to save this first
// var siteviews = [
// 	{
// 		name: 'home',
// 		views: 0
// 	},
// 	{
// 		name: 'about',
// 		views: 0
// 	},
// 	{
// 		name: 'services',
// 		views: 0
// 	},
// 	{
// 		name: 'team',
// 		views: 0
// 	},
// 	{
// 		name: 'posts', // name: 'blog',
// 		views: 0
// 	},
// 	{
// 		name: 'contact',
// 		views: 0
// 	}
// ]
// var siteview = new Siteview({siteviews})

// siteview.save()
module.exports = Siteview