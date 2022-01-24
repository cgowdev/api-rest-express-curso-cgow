const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
//const logger = require('./logger');
const morgan = require('morgan');
const usuarios = require('./routes/usuarios');
const app = express();

app.use(express.json());//Middle
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios)
//Configuracion de entornos
console.log('Aplicacion: ' + config.get('nombre'));
//console.log('Bd server: ' + config.get('configDB.host'));

//Uso de Middleware de terceros - Morgan
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    //console.log("Morgan hab")
    debug('Morgan iniciado.')
}

//Trabajos con la bd
debug('Conectando con la base de datos')

//app.use(logger);
/* app.use(function (req, res, next) {
    console.log('Autenficando...');
    next();
}); */

app.get('/', (req, res) => {
    res.send('Hola mundo desde Express.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});