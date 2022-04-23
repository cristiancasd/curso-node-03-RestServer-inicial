const { Router } = require("express");
const { check } = require('express-validator');
const { login } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router=Router();

router.post('/login',[
    check('correo','El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),      
    validarCampos
]  ,login );
// Solo ejecuto el controlador si pasa los middlewares

module.exports= router

