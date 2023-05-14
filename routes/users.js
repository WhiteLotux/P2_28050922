var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let comment = req.body.comment;
  let date = new Date();
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                       
    db.insert(name, email, comment, date, ip);

console.log({name, email, comment, date, ip});
  res.redirect('/')
});

const sqlite3 = require('sqlite3').verbose();

function select(database, table) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(database);
    const queries = [];
    db.each.SELECT row as key, * FROM ${table}, (err, row) => {
      if (err) {
        reject(err);
      }
      console.log(Push row ${row.key} from database.);
      queries.push(row);
    });
    console.log(queries);
    console.log(JSON.stringify(queries));
  });
}

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
