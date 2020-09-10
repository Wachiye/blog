var mongoose = require('mongoose')

var Schema = mongoose.Schema

var categorySchema = new Schema({
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
	tags:{
		type:[String]
	}
})

var categoryCollection = 'categories'

var Category = mongoose.model('Category', categorySchema, categoryCollection)

module.exports = Category
