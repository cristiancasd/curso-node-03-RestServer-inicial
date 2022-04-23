const Usuario=require('../models/usuario')
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');

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
module.exports={
    login
}

