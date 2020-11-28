const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generateJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {
    const { email, password } = req.body;
    const usuario;

    try {
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
                .input('email', email)
                .execute('stp_usuarios_login');
        }).then(result => {
            usuario = result.recordSet[0];
        }).catch(err => {
            usuario = null;
        });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "Email no Encontrado"
            });
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Contraseña Incorrecta"
            });
        }

        const token = await generateJWT(usuario.idUsuario);

        res.json({
            ok: true,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Qué pasó ahí? Estamos Agarrando Señal"
        });
    }
}

module.exports = {
    login
}