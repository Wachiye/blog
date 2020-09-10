var mongoose = require("mongoose")

var Schema = mongoose.Schema

var teamSchema = new Schema({
	id:{
		type: Schema.Types.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: String,
		allowNull: false
	},
	description:{
		type: String
	},
	hiring: {
		type: String
	},
	members:{
		type: type: Schema.Types.INTEGER,
		allowNull: false,
		default: 0
	}
})

var teamCollection = 'teams'
var Team = mongoose.model("Team", teamSchema, teamCollection)
module.exports = Team