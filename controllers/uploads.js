const path            =  require("path")
const fs              =  require('fs')
const { response }    =  require("express");
const {subirArchivo}  =  require('../helpers/subir-archivo');
const usuario         =  require("../models/usuario");
const producto        =  require("../models/producto");

const cloudinary =require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

require("colors");

const cargarArchivo= async(req,res=response)=>{

    //Tiene que venir el archivo nombrado archivo... es el que espero en el backend 
    //Está comentado porque lo hago antes en el middleware 
  /* // La validación lo hago en el middleware
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    console.log('el archivo no se encuentra');
    res.status(400).json({msg:'No hay archivos que subir'});
  return;
  } */

    try{ // Si el archivo no es del tipo esperado ocurre un error, por eso usamos el try      
      const pathCompleto=await subirArchivo(req.files,undefined,'img') //Subo el archibo en la carpeta establecida
      res.json({
        nombre: pathCompleto //Muestro en interfaz
      })
    }
    catch(err){
      res.status(400).json({err})
    }   
} 

const actualizarImagen= async (req,res=response)=>{

  // La validación de que exista un archivo lo hago en el middleware
  const {id, coleccion} = req.params;  //obtengo el id y colección ya validados  
  let modelo;
  switch(coleccion){
    case 'usuarios':
      modelo = await usuario.findById(id);  //Traigo el modelo de usuario completo
      if(!modelo){                          //Si nohay modelo retorno mensaje
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        });
      }
      break;      
      case 'productos':
      modelo = await producto.findById(id);   //Traigo el modelo de productos completo
      if(!modelo){                            //Si nohay modelo retorno mensaje
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({msg:'Se me olvidó validar esto'}); //Ya está validado en middleware
  }

  //Si existe modelo, vamos a Limpiar imagenes previas
  if(modelo.img){ //hay una imagen en mi base de datos     
    let pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img); 
    if (fs.existsSync(pathImagen)){                      //Existe archivo en el path
      fs.unlinkSync(pathImagen)                          //si existe, borro dicho archivo
    }
  }
  const nombre= await subirArchivo(req.files, undefined, coleccion); //Actualizo con nuevo archivo
  modelo.img=nombre;          //Actualizo la img del modelo
  await modelo.save();        //salvo modelo en la base de datos
  res.json(modelo);           //Presento el modelo completo con la img actualizada
}

const mostrarImagen= async (req, res=response)=>{
  const {id, coleccion} = req.params;   //Obtengo el id y la colección ya validadas
  
  let modelo;

  switch(coleccion){
    case 'usuarios':
      modelo = await usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        });
      }
      break; 
      case 'productos':
      modelo = await producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({msg:'Se me olvidó validar esto'});
  }

  //Modelo ya importado. Si existe imagen la envío 
    if(modelo.img){ //hay una imagen en mi base de datos     
      let pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img); 
      if (fs.existsSync(pathImagen)){                      //Existe archivo en el path
        return res.sendFile(pathImagen)                    //Enviar imagén
      }
    }

    //retornar una imagen diciendo que no se encontró imagen
    let pathImagen = path.join( __dirname, '../assets/', 'goku.png'); 
    return res.sendFile(pathImagen)

    //Si comento la imagen también puedo mostrar esto
    res.json({
      msg:'falta el place holder'
    });  
}


//actualizarImagenCloudinary
const actualizarImagenCloudinary= async (req,res=response)=>{

  // La validación de que exista un archivo lo hago en el middleware
  const {id, coleccion} = req.params;  //obtengo el id y colección ya validados  
  let modelo;
  switch(coleccion){
    case 'usuarios':
      modelo = await usuario.findById(id);  //Traigo el modelo de usuario completo
      if(!modelo){                          //Si nohay modelo retorno mensaje
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        });
      }
      break;      
      case 'productos':
      modelo = await producto.findById(id);   //Traigo el modelo de productos completo
      if(!modelo){                            //Si nohay modelo retorno mensaje
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({msg:'Se me olvidó validar esto'}); //Ya está validado en middleware
  }

  //Si existe modelo, vamos a Limpiar imagenes previas
  if(modelo.img){ //hay una imagen en mi base de datos     
    const nombreArr=modelo.img.split('/');
    const nombre=nombreArr[nombreArr.length-1];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const{tempFilePath}=req.files.archivo
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
  
  modelo.img=secure_url;

  await modelo.save();  
  res.json(modelo);           //Presento el modelo completo con la img actualizada
}


module.exports={
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}