const express = require('express');
const rutas = express.Router();
const Joi = require('joi');

const usuarios = [
    { id: 1, nombre: 'Jesus' },
    { id: 2, nombre: 'Alicia' },
    { id: 3, nombre: 'Gilberto' },
    { id: 4, nombre: 'Reyna' }
];

rutas.get('/', (req, res) => {
    res.send(usuarios);
});

rutas.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

rutas.post('/', (req, res) => {
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

rutas.put('/:id', (req, res) => {
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

rutas.delete('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
})

function existeUsuario(id) {
    return usuario = usuarios.find(u => u.id === parseInt(id));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(30).required()
    });
    return schema.validate({ nombre: nom });
}

module.exports = rutas;