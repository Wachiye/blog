// will establish database connection
const mysql = require("mysql")

//connection string
let config = {
    host: "sql9.mysqlfreehosting.net",
    user: "sql9317461",
    password: "X3PcvejZ1b",
    database: "sql9317461"
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
