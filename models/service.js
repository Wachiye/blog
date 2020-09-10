var mongoose = require('mongoose')

var Schema = mongoose.Schema

var serviceSchema = new Schema({
	id:{
		type: Schema.Types.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name:{
		type: String(15),
		allowNull: false
	},
	description:{
		type: String
	},
	image:{
		type:String,
		allowNull: false
	},
	level:{
		type:String,
		enum: ['Normal', 'Important'],
		default: 'Normal'
	}
})

var serviceCollection = 'services'

var Service = mongoose.model('Service', serviceSchema, serviceCollection)

module.exports = Service

