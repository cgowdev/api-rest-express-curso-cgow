const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
//const logger = require('./logger');
const morgan = require('morgan');
const Joi = require('joi');
const app = express();

app.use(express.json());//Middle
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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

const usuarios = [
    { id: 1, nombre: 'Jesus' },
    { id: 2, nombre: 'Alicia' },
    { id: 3, nombre: 'Gilberto' },
    { id: 4, nombre: 'Reyna' }
];

app.get('/', (req, res) => {
    res.send('Hola mundo desde Express.');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(30).required()
    });

    const { error, value } = validarUsuario(req.body.nombre);
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});

app.put('/api/usuarios/:id', (req, res) => {
    //Encontrar si existe el objeto
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const { error, value } = validarUsuario(req.body.nombre);
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});

function existeUsuario(id) {
    return usuario = usuarios.find(u => u.id === parseInt(id));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(30).required()
    });
    return schema.validate({ nombre: nom });
}