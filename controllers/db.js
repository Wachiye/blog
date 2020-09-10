require("dotenv").config();
// will establish database connection
const mysql = require("mysql");
const fs = require("fs");
const services = require("./services");
const settings = require("./settings");
//connection string
let config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  multipleStatements: true,
};
//instantiate connection
const conn = mysql.createConnection(config);

//actual connection
conn.connect(async (err) => {
  if (err) {
    throw err;
  } else {
    checkTables()
      .then((data) => {
        return createTables();
      })
      .then((data) => {
        return admins();
      })
      .then((data) => {
        info.admins = 0;
        info.admins = data;
        return getInfo();
      })
      .then((data) => {
        console.log("ready");
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
//required tables array
var tables = [
  "users",
  "members",
  "subscribers",
  "teams",
  "posts",
  "comments",
  "contacts",
  "testimonials",
  "categories",
  "services",
  "settings",
  "siteviews"
];
//mysql source file containing all  the tables schema queries end with ;
var tables_file = "./models/mysql/tables.sql";

//check all tables
var checkTables = () => {
  return new Promise(async (resolve, reject) => {
    var table_schema = process.env.MYSQL_DB;
    var tables_in_db = [];
    //sql
    var sql = `SELECT table_name FROM information_schema.tables where table_schema = ?`;
    //excute query
    conn.query(sql, table_schema, (err, db_tables) => {
      if (err) {
        resolve(err);
      } else {
        // db_tables.forEach( async function(table){
        // 		tables_in_db.push(table.TABLE_NAME)
        // })
        // resolve({"TABLES_EXPECTED": tables,"TABLES_IN_DB":tables_in_db})
        resolve(db_tables);
      }
    });
  });
};
var createTables = () => {
  return new Promise(async (resolve, reject) => {
    let data_file = fs.readFile(tables_file, "utf8", (err, data) => {
      if (err) {
        resolve(err);
      } else {
        conn.query(data, (err, tables_created) => {
          if (err) {
            resolve(err.message);
          } else {
            resolve(tables_created);
          }
        });
      }
    });
  });
};
var admins = () => {
  return new Promise(async (resolve, reject) => {
    let sql = `SELECT COUNT(id) AS admins FROM users WHERE category = 'Administrator'`;
    conn.query(sql, (err, users) => {
      if (err) {
        resolve([]);
      } else {
        resolve(users[0].admins);
      }
    });
  });
};
var getInfo = async () => {
  return new Promise(async (resolve, reject) => {
    console.log("Fetching site info");
    info.site = await settings.getSettings();
    console.log("checking site services");
    info.services = await services.getServices();
    info.site = info.site.settings;
    info.services = info.services.services;
    resolve(info);
  });
};
module.exports = conn;
