const Usuario=require('../models/usuario')
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');
const { response } = require('express');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');
require('colors')
const login=async (req,res)=>{

    const{correo,password}=req.body;
    try{
        const usuario=await Usuario.findOne({correo});              
        if(!usuario){                                                   //Confirmo que el correo exista
            return res.status(400).json({
                msg:'Usuario / password no son correctos - correo'
            })
        }
        if(usuario.false){                                              //Confirmo estado del usuario
            return res.status(400).json({
                msg:'El usuario ya fue eliminado'
            })
        }
        const validPassword=bcryptjs.compareSync(password,usuario.password); 
        if(!validPassword){                                             //Confirmo contraseña valida
            return res.status(400).json({
                msg:'Usuario / password no son correctos - Password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)                      //Genero un token

        res.json({
            msg:'Login ok',
            usuario,
            token
        })
        
    }catch(error){
        console.log(error)
        res.status(500).json({  //internal server error
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn=async(req, res=response)=>{        //Req cuenta con el token
    
    const{id_token}=req.body;
    
    try{
        
        const googleUser=await googleVerify(id_token) //Verifico el token y recibo el usuario google
        const {correo, nombre, img} = await googleVerify(id_token) //Verifico el token y recibo el usuario google
        
        //const googleUser={correo, nombre, img}
        let usuario=await Usuario.findOne({correo});

        if(!usuario){
            const data={
                nombre,
                correo,
                password:'cualquiercosa',
                img,
                google:true,
                rol:"USER_ROLE"
            };
            usuario=new Usuario(data);
            console.log('voy a guardar en mi DB al usuario ...'.red, usuario)
            await usuario.save()

        }

        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }

        const token=await generarJWT(usuario.id);

        console.log('usuario google es: '.red, googleUser);       
        
        res.json({
            usuario,
            token
        })

    }catch(err){

        console.log('error es ============================================================');
        console.log('err');
        console.log('error fue ============================================================');
        res.status(400).json({
            ok:false,
            msg:'El google token no se pudo verificar'
        })
    }
}

module.exports={
    login,
    googleSignIn
}


