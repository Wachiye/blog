var mongoose = require("mongoose")

var Schema = mongoose.Schema

var settingSchema = new Schema({
	id:{
		type: Schema.Types.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	setting: {
		type: String,
		allowNull: false
	},
	content:{
		type: [String]
	}
})
var settingCollection = 'settings'

var Setting = mongoose.model('Setting', settingSchema, settingCollection)

module.exports = Setting