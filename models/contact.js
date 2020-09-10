ar mongoose = require('mongoose')

var Schema = mongoose.Schema

var contactSchema = new Schema({
	id:{
		type: Schema.Types.INTEGER
		autoIncrement: true,
		primaryKey: true
	},
	fullname:{
		type: String
	},
	email:{
		type: String
	},
	message:{
		type: String
	},
	date:{
		type: Date,
		default: Date.now()
	},
	status:{
		type: String,
		default: 'unread'
	}
})

var contactCollection = 'contacts'

var Contact = mongoose.model('Contact', contactSchema, contactCollection)

module.exports = Contact