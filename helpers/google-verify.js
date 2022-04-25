const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
require('colors')

async function googleVerify(token='') {             //Recibo el token dado por google
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log('--------------------------------------++++++---------------'.red, payload);
    const {name,picture,email}=ticket.getPayload(); //Payload tiene la información del usuario google
    return{                                         //Retorno información de usuario
        nombre: name, 
        img: picture, 
        correo: email
    }
  }
  module.exports={
      googleVerify
  }

