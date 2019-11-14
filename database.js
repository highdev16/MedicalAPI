var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            created_date text,
            isApproved int,
            ip_address text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,(err) => {
        if (err) {
            // Table already created
            console.log("Table already created");
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO user (name, email, password, created_date, isApproved, ip_address) VALUES (?,?,?,?, ?)'
            db.run(insert, ["admin","admin@example.com", md5("admin123456"), new Date().getTime(), 1])
            db.run(insert, ["user","user@example.com", md5("user123456"), new Date().getTime(), 0])
        }
    })  
    }
})


module.exports = db

