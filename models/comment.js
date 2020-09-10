ar mongoose = require('mongoose')

var Schema = mongoose.Schema

var commentSchema = new Schema({
	id:{
		type: Schema.Types.INTEGER
		autoIncrement: true,
		primaryKey: true
	},
	user:{
		type: [String],
		allowNull: false
	},
	post_id:{
		type: String
	},
	comment:{
		type: String
	},
	date:{
		type: Date,
		default: Date.now()
	},
	status:{
		type: String,
		default: 'unread'
	},
	approved:{
		type:String,
		default: null
	}
})

var commentCollection = 'comments'

var Comment = mongoose.model('Comment', commentSchema, commentCollection)

module.exports = Comment