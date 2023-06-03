const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database(':index.db',(err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');

    db.run("CREATE TABLE IF NOT EXISTS contactos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, cell TEXT NOT NULL, comment TEXT NOT NULL, date TEXT NOT NULL, ip TEXT NOT NULL, country TEXT NOT NULL)");
});

module.exports = {
    insert: function (name, email, cell, comment, Datetime, myIP, country) {
        db.run("INSERT INTO contactos (name, email, cell, comment, date, ip, country) VALUES (?, ?, ?, ?, ?, ?, ?)", [name, email, cell, comment, Datetime, myIP, country], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    },
    select: function (callback) {
        db.all("SELECT * FROM contactos", [], (err, rows) => {
            if (err) {
                throw err;
            }
            callback(rows);
        });
    }
}