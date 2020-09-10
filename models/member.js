var mongoose = require('mongoose');

var Schema = mongoose.Schema

var memberSchema = new Schema({
	id:{
		type: Schema.Types.INTEGER
	},
	fullname:{
		type: String
	},
	email: {
		type: String
	},
	phone:{
		type: String
	},
	specialization: {
		type: [String],
		default: 'Web Design'
	},
	languages: {
		type: [String],
		default: ['HTML','CSS','JavaScript']
	},
	team_id:{
		type: Schema.Types.INTEGER,
		default: 0
	},
	team_name: {
		type:String,
		default: 'General'
	},
	role:{
		type:String,
		default:'Member'
	},
	image: {
		type:String
		default: 'Person.png'
	}
})

var memberCollection = 'members'

var Member = mongoose.model('Member', memberSchema. memberCollection)

module.exports = Member