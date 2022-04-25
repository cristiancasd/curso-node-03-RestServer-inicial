const express = require('express')
const cors = require('cors');
const dbConnection = require('../database/config');

class Server{

    // Clase principal

    constructor(){                              //En el constructor van las propiedades
        this.app = express();                   //servir contenido estatico
        this.port = process.env.PORT;           //definir puerto de conexión
        this.authPath='/api/auth';              //path para autenticación
        this.usuariosPath='/api/usuarios';      //path para interacción base de datos usuarios
        this.conectarDB();                      //conectar a base de datos     
        this.middlewares();                     //Funciión que siempre va a ejecuarse cuando levantemos nuestro servidor
        this.routes();                           
    }

    async conectarDB(){
        await dbConnection();   //conectar con la base de datos
    }

    middlewares(){      //(.use es la palabra para saber que es un middleware)

        this.app.use(cors());          //API solo ciertas páginas web pueden acceder a ellas, proteges tu servidor       
        this.app.use(express.json());  //Lectura y parseo del body (cualquier información en POST, PUT, DELATE, ls vs s intentar)        
        this.app.use(express.static('public'))  //Directorio publico  (busca el index)
        //this.app.use(express.static(__dirname + "/public"));
    }

    routes(){       //Defino las rutas de mi aplicación
        this.app.use(this.authPath,require('../routes/auth'));      // En el path ... ejecuto ...
        this.app.use(this.usuariosPath,require('../routes/user'));  // En el path ... ejecuto ...
    }

    listen(){       //No está en el constructor
        this.app.listen(this.port, ()=>{                            // Metodo express ... escuchar en el puerto
            console.log('servidor corriendo en port',this.port)
        });
    }
}
module.exports=Server


