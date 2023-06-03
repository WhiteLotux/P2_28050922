let express = require('express');
const db = require('../database');
let router = express.Router();
const request = require ('request');
const IP = require ('ip');
const nodemailer = require('nodemailer');
require('dotenv').config();

//Pagina de inicio 
router.get('/', function(req, res, next) {
  let name = 'Omar Pimentel'
  res.render('index', {
    title: 'Formulario de contacto',
    name: name, });});


//Ejecuta acciones del formulario
router.post('/', function(req, res, next) {  
  //Declaracion de variables locales

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
        //Lista de correos 
        to: ['fuertegamer16@gmail.com', 'archpaladinsoul@gmail.com', 'programacion2ais@dispostable.com'],
        subject: 'Task 3: Third Party Connection ',
        text: 'Un nuevo usuario se ha registrado en el formulario:\n' + 'Nombre: ' + name + '\nCorreo: ' + email + '\nTelefono: ' + cell + '\nMensaje: ' + comment + '\nFecha y hora: ' + Datetime + '\nIP: ' + myIP + '\nUbicacion: ' + country
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Correo electrónico enviado: ' + info.response);
        }});}});
       
    //Redirigir a pagina nuevamente
    res.redirect('/');
});

//Insertar datos
router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    console.log(rows);
  });
  res.send('ok');
});

module.exports = router;

