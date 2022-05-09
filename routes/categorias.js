require('express-validator');

const { Router } = require("express");
const { check } = require('express-validator');
const { crearCategoria, ObtenerCategorias, ObtenerCategoria, actualizarCategoria, categoriasDelete } = require("../controllers/categorias");
const { existeCategoria, existeUsuarioId, existeCategoriaPorID } = require("../helpers/db-validators");
const { validarCampos, validarJWT, tieneRole, esAdminRole } = require("../middlewares");

const router=Router();

//Obtener las categorías público
router.get('/',ObtenerCategorias);

//Obtener una por id categoría público
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorID),  
    validarCampos   
],
ObtenerCategoria);

//Crear categoría - privado- cualquier usuario con token  valido
router.post('/',[
    validarJWT,    
    check('nombre','EL nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(existeCategoria),
    validarCampos
],crearCategoria);

//Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id').custom(existeCategoriaPorID), 
    check('nombre','el nomre es obligatario').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),
    validarCampos
],
actualizarCategoria);

//Borrar una categoría - Admin
router.delete('/:id',[ 
    validarJWT,                                      //Es la primera que se valida, que el token sea correcto
    esAdminRole,                                   //Solo un rol permitido
    //tieneRole('ADMIN_ROLE', 'USER_ROLE','VENTAS_ROL'),             //Escoger el rol permitido
    check('id','No es un ID válido').isMongoId(),    //Revisa que sea un tipo mongo, no revisa si existe en mongo
    check('id').custom(existeCategoriaPorID),
    validarCampos                                    //No continua a la ruta si hay un error en los checks
],categoriasDelete);


module.exports= router;

