var express = require('express');
const db = require('../database');
var router = express.Router();
const request = require ('request');
const IP = require ('ip');
const nodemailer = require('nodemailer');
require('dotenv').config();
var app = require('../app');

//Pagina de inicio 
router.get('/', function(req, res, next) {
  let name = 'Omar Pimentel'
  res.render('index', {
    title: 'Formulario de contacto',
    name: name, });
});

router.get('/login', (req, res) => {
  res.render('login');
 });

 router.post('/login', function(req, res, next) {
  let user = req.body.user
  let pass = req.body.pass
  if (user == process.env.username && pass == process.env.clave)  {
    db.select(function (rows) {
      // console.log(rows);
      res.render('contactos', {rows: rows});
    });
  } else {
    res.render('login', { error: 'Datos incorrectos' });
  }
})

router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    // console.log(rows);
    res.render('contactos', {rows: rows});
  });
 
});



//Ejecuta acciones del formulario
router.post('/', function(req, res, next) {  
  //Declaracion de variables locales
  const captcha = req.body['g-recaptcha-response'];
  const secretKey = process.env.SecretKey;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;
  let name = req.body.name;
  let email = req.body.email;
  let cell = req.body.cell;
  let comment = req.body.comment;
  let date = new Date();
  let fecha = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  let Datetime = fecha;
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const myIP = ip.split(",")[0];

  



  //Localizar pais de origen de la IP
  request(`http://ip-api.com/json/${myIP}`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      let country = data.country;
      //Mostrar datos ingresados pos consola
      console.log({name, email, cell, comment, Datetime, myIP, country});
      //Insertar daton en la base de datos
      db.insert(name, email, cell, comment, Datetime, myIP, country);
      
      
      //Enviar email con los datos ingresados 
      const transporter = nodemailer.createTransport({
        host: process.env.hostemail,
        port: 465,
        secure: true,
        auth: {
            user: process.env.useremail,
            pass: process.env.passemail
        }
      });
      const mailOptions = {
        from: process.env.useremail,
        //Lista de correo a enviar
        to: ['programacion2ais@dispostable.com'],
        subject: 'P2_28050922',
        text: 'Un nuevo usuario se ha registrado en el formulario:\n' + 'Nombre: ' + name + '\nCorreo: ' + email + '\nTelefono: ' + cell + '\nMensaje: ' + comment + '\nFecha y hora: ' + Datetime + '\nIP: ' + myIP + '\nUbicacion: ' + country
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Correo electrónico enviado: ' + info.response);
        }});}});
    
        request(url, (err, response, body) => {
          if (body.success && body.score) {
            console.log('exitoso')
          } else {
            console.log('fracaso')
          }
        });
  
    res.redirect('/');
});

router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    console.log(rows);
  });
  res.send('ok');
});

module.exports = router; 
