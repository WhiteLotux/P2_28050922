var express = require('express');
var router = express.Router();
const db = require('../database');
const requestIp= require('request-ip');
const { request } = require('http');
const { json } = require('body-parser');
const geoip = require('geoip-lite')
const nodemailer = require('nodemailer')
require('dotenv').config();
var app = require('../app');

const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client('410114851897-63psg9avuqqusagaddkhvb1hc90nl1av.apps.googleusercontent.com');

async function getEmail(datos) {
  // Verificar el token JWT y obtener la información del usuario
  const ticket = await client.verifyIdToken({
    idToken: datos.credential,
    audience: '410114851897-63psg9avuqqusagaddkhvb1hc90nl1av.apps.googleusercontent.com'
  });
  // Obtener un objeto con la información del usuario
  const user = ticket.getPayload();
  // Obtener el email del usuario
  const email = user.email;
  // Devolver el email
  return email;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Ir al login
router.get('/login', function(req, res, next) {
  // res.render('login');
  res.render ('login', { error: false });

});

router.post('/login', function(req, res, next) {
  let user = req.body.user
  let pass = req.body.pass
  if (user == process.env.ADMIN_USER && pass == process.env.ADMIN_PASS)  {
    db.select(function (rows) {
      // console.log(rows);
      res.render('contactos', {rows: rows});
    });
  } else {
    res.render('login', { error: 'Datos incorrectos' });
  }
})


// Ir a contactos
router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    // console.log(rows);
    res.render('contactos', {rows: rows});
  });
 
});
router.post('/logueo', function(req, res, next){
  const datos = req.body;
  // Llamar a la función getEmail() para obtener el email del usuario
  getEmail(datos).then(email => {
    if (email == process.env.EMAIL_GOOGLE) {
      db.select(function (rows) {
        // console.log(rows);
        res.render('contactos', {rows: rows});
      });
    } else {
      res.status(500).send("Error al verificar el token, No eres un usuario autorizado");
    }
    
  })
})

router.post('/', function(req, res, next) {
  // console.log(process.env)
  let name = req.body.name;
  let email = req.body._replyto;
  let comment = req.body.comment;
  let date = new Date(); 
  const clientIp = requestIp.getClientIp(req)
  const ip = clientIp
  let now = date.toLocaleString()
  // let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // @todo falta formatear la ip
  let loc
   // replace with the IP address you want to look up
  // const geo = geoip.lookup("190.37.91.206");
    const geo = geoip.lookup(ip);

  loc = (geo.country);

  db.insert(name, email, comment, now, ip, loc);
  
  //Crear Transportador de correo
  var transporter = nodemailer.createTransport ({
    
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    // service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Crear un objeto de opciones de correo
  var mailOptions = {
    nombre: name,
    from: email,
    to: process.env."programacion2ais@dispostable.com",
    // to: "kelvinpaez2004@gmail.com",
    subject: 'Contacto desde el formulario',
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
  res.redirect('/contact');
});
  

router.get('/contact', function(req, res, next) {
  db.select(function (rows) {
    console.log(rows);
  });
  res.send('Se ha guardado la informacion del formularion en la base de datos y se envio el correo electronico');
});


module.exports = router;
