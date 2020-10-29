const Router = require('express');
const conString = require('../database/config');
const sql = require('mssql');
const router = Router();

//Docentes GetAll
router.get('/', (req, res) => {
    sql.on('error', err => {
        console.log(err);
        res.json(res);
    });
    sql.connect(conString).then(pool => {
        return pool.request().execute('stp_docentes_getall');
    }).then(result => {
        res.json(result.recordset);
    }).catch(err => {
        res.json(err);
    });
});

//Docentes Get All by ID
router.get('/:id', (req, res) => {
    sql.on('error', err => {
        console.log(err);
        res.json(res);
    });
    sql.connect(conString).then(pool => {
        return pool.request()
            .input('idDocente', req.params.id)
            .execute('stp_docentes_getbyid')
    }).then(result => {
        res.json(result.recordset[0]);
    }).catch(err => {
        res.json(err);
    });
});

//Docentes ADD
router.post('/', (req, res) => {
    sql.on('error', err => {
        console.log(err);
        res.json(res);
    });
    sql.connect(conString).then(pool => {
        return pool.request()
            .input('nombre', req.body.nombre)
            .input('edad', req.body.edad)
            .input('titulo', req.body.titulo)
            .input('tipo', req.body.tipo)
            .execute('stp_docentes_add');
    }).then(result => {
        res.status(201).json({
            status: "Ok",
            msg: "Docente añadido correctamente"
        });
    }).catch(err => {
        res.json(err);
    });
});

//Docentes UPDATE
router.put('/:id', (req, res) => {
    sql.on('error', err => {
        console.log(err);
        res.json(res);
    });
    sql.connect(conString).then(pool => {
        return pool.request()
            .input('idDocente', req.params.id)
            .input('nombre', req.body.nombre)
            .input('edad', req.body.edad)
            .input('titulo', req.body.titulo)
            .input('tipo', req.body.tipo)
            .execute('stp_docentes_update');
    }).then(result => {
        res.status(201).json({
            status: "Ok",
            msg: "Docente actualizado correctamente"
        });
    }).catch(err => {
        res.json(err);
    });
});

//Docentes DELETE
router.delete('/:id', (req, res) => {
    sql.on('error', err => {
        console.log(err);
        res.json(res);
    });
    sql.connect(conString).then(pool => {
        return pool.request()
            .input('idDocente', req.params.id)
            .execute('stp_docentes_delete');
    }).then(result => {
        res.status(201).json({
            status: "Ok",
            msg: "Docente eliminado correctamente"
        });
    }).catch(err => {
        res.json(err);
    });
});

module.exports = router;