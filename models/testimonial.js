var mongoose = require("mongoose")

var testimonialSchema = mongoose.Schema({
	id:{
		type: Schema.Types.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name:{ 
		type: String,
		allowNull: true
	},
	email:{
		type: String,
		allowNull: false
	},
	job:{ 
		type: String,
		allowNull: true
	},
	company: { 
		type: String,
		allowNull: true
	},
	testimony: {
		type: String,
		required: [true, 'Empty testimonial']
	},
	status:{
		type: String,
		default: 'unread'
	}
})

var testimonialCollection = 'testimonials'

var Testimonial = mongoose.model('testimonial', testimonialSchema, testimonialCollection)
module.exports = Testimonial
