var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next)){
  let name = req.body.name;
  let email = req.body.email;
  let comment = req.body.comment;
  let date = new Date();
  let ip = req.headers['x-forwarde-for] || req.socket.remoteAddress;
                       
    db.insert(name, email, comment, date, ip);

console.log({name, email, comment, date, ip});
  res.redirect('/')
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
