var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
	id:{
		type: Schema.Types.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true
	},
	username:{
		type: Schema.Types.STRING(15),
		allowNull: false
	}, 
	fullname:{
		type: Schema.Types.STRING(15),
		allowNull: false
	}, 
	email:{ 
		type: String,
		allowNull: false
	},
	password: { 
		type: String,
		allowNull: false
	},
	category: { 
		type: String,
		default: 'User'
	},
	image: { 
		type: String,
		default: 'Person.png'
	},
	website:{ 
		type: String,
		allowNull: true
	},
	dateCreated:{
		type: Date,
		default: Date.now()
	},
	posts: {
		type: Schema.Types.INTEGER,
		default: 0
	},
	commenta: {
		type: Schema.Types.INTEGER,
		default: 0
	},
})
var userCollection = 'users'

var User = mongoose.model('User', userSchema, userCollection)

module.exports = User