const mysql = require("mysql2");
require("dotenv").config();

//user account info
const mysqlConnection = mysql.createConnection({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DB_NAME,

});

// data connection
const connectDB = mysqlConnection.connect((err) => {
  if (err) console.log(err);
  else console.log("DB Connected");
});

module.exports = { mysqlConnection, connectDB };
