var mongoose = require('mongoose');

var Schema = mongoose.Schema

var postSchema = new Schema({
	id:{
		type: String,
		primaryKey: true,
		allowNull: false
	},
	author:{
		type: String,
		allowNull: false
	},
	title: {
		type: String,
		allowNull: false
	},
	excerpt:{
		type: String,
		allowNull: false
	},
	content: {
		type: String,
		allowNull: false
	},
	image: {
		type:String,
		allowNull: true
	},
	dateCreated:{
		type: Date,
		default: Date.now()
	},
	views:{
		type: Schema.Types.INTEGER,
		default: 0
	},
	comments:{
		type: Schema.Types.INTEGER,
		default: 0
	},
	category:{
		type: String,
		default : 'undefined'
	},
	tags:{
		type: [String],
		default: ['undefined']
	}
	
})

var postCollection = 'posts'

var Post = mongoose.model('post', postSchema. postCollection)

module.exports = Post