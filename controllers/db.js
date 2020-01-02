// will establish database connection
const mysql = require("mysql")

//connection string
let config = {
    host: "localhost",
    user: "root",
    password: "sirah",
    database: "blog"
}
//instantiate connection
const conn = mysql.createConnection(config)

//actual connection
conn.connect((err)=>{
    if(err){
        throw err
   }
})

module.exports = conn