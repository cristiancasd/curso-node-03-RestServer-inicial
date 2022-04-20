require('express-validator')

const { Router } = require("express");
const { check } = require('express-validator');
const { usuariosGet, usuariosDelete, usuariosPost, usuariosPut } = require("../controllers/usuarios");
const { esRoleValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const Role = require('../models/role');



const router=Router();

router.get('/', usuariosGet);

//Obtener un valor de manera dinámica 
//así lo configuro en express y lo parsea y me lo da en una varialbe
router.put('/:id',[
    check('id','No es un ID válido').isMongoId(), //Revisa que sea un tipo mongo, no revisa si existe en mongo
    check('id').custom(existeUsuarioId),
    check('rol').custom(esRoleValido),
    validarCampos //No continua a la ruta si hay un error en los checks
], usuariosPut );

//con Express validator, cada una va llenando la información en request, y al final te pasa
//un objeto con todos los errores
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mínimo 5 caracteres').isLength(6,100),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(emailExiste), 
    //check('rol','Rol no permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),    //es lo mismo que lo de abajo
    //check('rol').custom((rol)=>esRoleValido(rol)), 
    validarCampos
] ,usuariosPost );
// Solo ejecuto el controlador si pasa los middlewares



//router.post('/',usuariosPost );

router.delete('/:id',[
    check('id','No es un ID válido').isMongoId(), //Revisa que sea un tipo mongo, no revisa si existe en mongo
    check('id').custom(existeUsuarioId),
    validarCampos //No continua a la ruta si hay un error en los checks
],usuariosDelete);



module.exports= router