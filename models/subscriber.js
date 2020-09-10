var mongoose = require("mongoose")

var Schema = mongoose.Schema

var subscriberSchema = new Schema({
	id:{
		type: Schema.Types.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	username:{ 
		type: String,
		allowNull: false
	},
	email:{ 
		type: String,
		allowNull: false
	},
	website: { 
		type: String,
		allowNull: true
	},
	comments: {
		type: Schema.Types.INTEGER,
		default: 0
	},
	dateCreated:{
		type: Date,
		default: Date.now()
	}
})

var subscriberCollection = 'subscribers'

var Subscriber = mongoose.model('Subscriber', subscriberSchema, subscriberCollection)
module.exports = Subscriber