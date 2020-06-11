// will establish database connection
const mysql = require("mysql")

require('dotenv').config()

//connection string
let config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}
//instantiate connection
const conn = mysql.createConnection(config)

//actual connection
conn.connect((err)=>{
    if(err){
        console.log(config)
        throw err
   }
    else{
        console.log("Coonnected", $conn)
    }
})

module.exports = conn
