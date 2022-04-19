const express = require('express')
const cors = require('cors');
const dbConnection = require('../database/config');

class Server{
    constructor(){ //En el constructor van las propiedades
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath='/api/usuarios';
        
        //conectar a base de datos
        this.conectarDB();
        
        //Funciión que siempre va a ejecuarse cuando levantemos nuestro servidor
        this.middlewares();  
        this.routes();   
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        this.app.use(cors());


        
        //Lectura y parseo del body
        this.app.use(express.json());
        //cualquier información en POST, PUT, DELATE, ls vs s intentar 
        //serializar en un .json


        //Directorio publico 
        //(use es la palabra para saber que es un middleware)
        this.app.use(express.static('public'))
    }
    routes(){//Defino las rutas de mi aplicación
        this.app.use(this.usuariosPath,require('../routes/user'));
    }
    listen(){
        this.app.listen(this.port, ()=>{
            console.log('servidor corriendo en port',this.port)
        });
    }
}
module.exports=Server


