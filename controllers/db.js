// will establish database connection
const mysql = require("mysql")

//connection string
let config = {
    host: "db4free.net",
    user: "expdblog",
    password: "expdblog",
    database: "expdblog"
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
