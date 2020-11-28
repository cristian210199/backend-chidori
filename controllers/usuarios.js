const { response } = require('express');
const conString = require('../database/config');
const sql = require('mssql');
const bcrypt = require('bcryptjs');

const getUsuarios = async(req, res) => {
    sql.on('error', err => {
        console.log(err);
        res.json({
            ok: false,
            error: err
        });
    });

    sql.connect(conString).then(pool => {
        return pool.request().execute('stp_usuarios_getall');
    }).then(result => {
        res.json({
            ok: true,
            usuarios: result.recordset
        });
    }).catch(err => {
        res.json({
            ok: false,
            error: err
        });
    });
}

const getUsuario = async(req, res = response) => {
    const idUsuario = req.params.id;
    sql.on('error', err => {
        console.log(err);
        res.json({
            ok: false,
            error: err
        });
    });

    //agregar al usuario
    sql.connect(conString).then(pool => {
        return pool.request()
            .input('idUsuario', idUsuario)
            .execute('stp_usuarios_getbyid');
    }).then(result => {
        res.status(201).json({
            ok: true,
            usuario: result.recordset[0]
        });
    }).catch(err => {
        res.json({
            ok: false,
            message: err
        });
    });
}

const addUsuario = async(req, res = response) => {
    const { nombre, email, password } = req.body;
    sql.on('error', err => {
        console.log(err);
        res.json({
            ok: false,
            error: err
        });
    });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    password = bcrypt.hashSync(password, salt);

    //agregar al usuario
    sql.connect(conString).then(pool => {
        return pool.request()
            .input('nombre', nombre)
            .input('email', email)
            .input('password', password)
            .execute('stp_usuarios_add');
    }).then(result => {
        res.status(201).json({
            ok: true,
            usuario: result.recordset[0]
        });
    }).catch(err => {
        res.json({
            ok: false,
            message: err
        });
    });
}

const updateUsuario = async(req, res = response) => {
    const idUsuario = req.params.id;
    const { nombre, email, password } = req.body;
    sql.on('error', err => {
        console.log(err);
        res.json({
            ok: false,
            error: err
        });
    });

    sql.connect(conString).then(pool => {
        return pool.request()
            .input('idUsuario', idUsuario)
            .input('nombre', nombre)
            .input('email', email)
            .input('password', password)
            .execute('stp_usuarios_update');
    }).then(result => {
        res.status(201).json({
            ok: true,
            usuario: result.recordset[0]
        });
    }).catch(err => {
        res.json({
            ok: false,
            message: err
        });
    });
}

const deleteUsuario = async(req, res = response) => {
    const idUsuario = req.params.id;
    sql.on('error', err => {
        console.log(err);
        res.json({
            ok: false,
            error: err
        });
    });

    sql.connect(conString).then(pool => {
        return pool.request()
            .input('idUsuario', idUsuario)
            .execute('stp_usuarios_delete');
    }).then(result => {
        res.status(201).json({
            ok: true,
            msg: "Usuario Eliminado Correctamente"
        });
    }).catch(err => {
        res.json({
            ok: false,
            message: err
        });
    });
}

module.exports = {
    getUsuarios,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuario
}