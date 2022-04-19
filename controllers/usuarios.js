const bcryptjs=require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario=require('../models/usuario');


//const Usuario = require('../models/usuario');


const usuariosGet = (req, res) =>{
    
    //http://localhost:8080/api/usuarios/?q=hola&nom=carlos&ap=fernad
    const query=req.query;

    //Si lo destructuro
    const {q,nom,ap,id='no id',ciudad='no ciudad'}=req.query;

    res.json({
        msg:'get API - controlador',
        q,nom,ap,id,ciudad
    });

    
};

const usuariosPut =  (req, res) =>{
    //http://localhost:8080/api/usuarios/12
    //id va a ser 12
    const {id}=req.params;

    res.json({
        msg:'put API',
        id
    });
}

const usuariosPost = async (req, res) =>{

    //Es ineficiente tener que pegar este códigp en todo lado para 
    //evitar erorres, vamos a optimizarlo
    //Este condicional lo vamos a hacer por medio del middlewest
    /*
    const errors=validationResult(req);    
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }*/ 

    //En postman en el body creo un objeto con nombre,edad
    //destructuro el body solo la información que me interesa
    //const body=req.body;

    const {nombre,correo,password, rol} = req.body
    const usuario=new Usuario({nombre,correo,password, rol});
    

    //Comprobar si el correo existe
    const existeEmail=await Usuario.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            msg:'El correo ya está registrado'
        })
    }


    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password=bcryptjs.hashSync(password, salt)
    
    await usuario.save();
    res.json({
        msg:'post API',
        usuario
    });
    
    //Se puede destructurar
    /*const {nombre,edad}=req.body;
    res.json({
        msg:'post API',
        nombre,
        edad
    });*/
} 

const usuariosDelete =  (req, res) =>{
    res.json({
        msg:'delete API'
    });
}

module.exports={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete

}