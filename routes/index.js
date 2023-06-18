var express = require('express');
var router = express.Router();
const db = require('../database');
const requestIp= require('request-ip');
const { request } = require('http');
const { json } = require('body-parser');
const geoip = require('geoip-lite')
const nodemailer = require('nodemailer')
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  // console.log(process.env)
  let name = req.body.name;
  let email = req.body.email;
  let comment = req.body.comment;
  let date = new Date(); 
  const clientIp = requestIp.getClientIp(req)
  const ip = clientIp
  let now = date.toLocaleString()
  // let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // @todo falta formatear la ip
  let loc
   // replace with the IP address you want to look up
  const geo = geoip.lookup(ip);
  loc = (geo.country);

  db.insert(name, email, comment, now, ip, loc);
  
  //Crear Transportador de correo
  const transporter = nodemailer.createTransport ({
    
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    // service: 'gmail',
    auth: {
      user: 'fuertegamer16@gmail.com',
      pass: 'omarenrique123'
    }
  });

  // Crear un objeto de opciones de correo
  const mailOptions = {
    nombre: name,
    from: 'fuertegamer16@gmail.com',
    to: 'programacion2ais@dispostable.com',
    // to: ,
    subject: 'Contacto desde el formulario Realizado',
    text: "Enviado por " + name + "\nEmail: " + email + "\nMensaje: " + comment + "\nIP: " + ip + "\nPais: " + loc
  };

  // Enviar el correo electrónico con el transportador
  transporter.sendMail (mailOptions, function (error, info) {
    // Manejar el error o la respuesta
    if (error) {
      console.log (error);
      res.send ('Ocurrió un error al enviar el correo.');
    } else {
      console.log ('Correo enviado: ' + info.response);
      res.send ('Correo enviado correctamente.');
    }
  });
  res.redirect('/contactos');
});
  

router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    console.log(rows);
    
  });
  res.send('Se ha guardado la informacion del formularion en la base de datos y se envio el correo electronico');
});


module.exports = router;
