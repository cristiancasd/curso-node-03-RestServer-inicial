require('express-validator')

const { Router } = require("express");
const { check } = require('express-validator');
const { usuariosGet, usuariosDelete, usuariosPost, usuariosPut } = require("../controllers/usuarios");
const { validarCampos } = require('../middlewares/validar-campos');
const Role = require('../models/role');



const router=Router();

router.get('/', usuariosGet);

//Obtener un valor de manera dinámica 
//así lo configuro en express y lo parsea y me lo da en una varialbe
router.put('/:id', usuariosPut );

//con Express validator, cada una va llenando la información en request, y al final te pasa
//un objeto con todos los errores
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mínimo 5 caracteres').isLength(6,100),
    check('correo','El correo no es valido').isEmail(),
    //check('rol','Rol no permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(async(rol)=>{
        //const existeRol = await Role.findOne({rol});
        const existeRol = await Role.findOne({rol});
        if(!existeRol){
            throw new Error(' El rol no está registrado en la BD')
        }
    }),    
    validarCampos
] ,usuariosPost );
// Solo ejecuto el controlador si pasa los middlewares



//router.post('/',usuariosPost );

router.delete('/',usuariosDelete);



module.exports= router