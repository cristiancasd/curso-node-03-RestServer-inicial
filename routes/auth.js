const { Router } = require("express");
const { check } = require('express-validator');
const { login } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router=Router();

router.post('/login',[
    check('correo','El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),      
    validarCampos
]  ,login );                                                                //Si el correo y contraseña son datos correctos a login
                                          

module.exports= router

