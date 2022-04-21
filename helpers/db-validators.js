const Role=require('../models/role');
const Usuario=require('../models/usuario');


const esRoleValido=async(rol='')=>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(' El rol no está registrado en la BD')
    }
}

const emailExiste=async(correo='')=>{
    //Comprobar si el correo existe
  const existeEmail=await Usuario.findOne({correo});
  if(existeEmail){
    throw new Error('Ya se está usando el correo')
  }
}

const existeUsuarioId=async(id)=>{
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario){
    throw new Error('El id no existe')
  }
}
  
module.exports={
    esRoleValido, 
    existeUsuarioId,
    emailExiste
}