// libreria para usar whatsapp web
const { Client, LocalAuth } = require('whatsapp-web.js');

// libreria para usar prompts dentro de simbolo de sistema
const prompt = require('prompt-sync')();

// libreria para generar codigo qr
const qrcode = require('qrcode-terminal');

// libreria para generar archivo .txt 
var fs = require('fs');
var logger = fs.createWriteStream('Response.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  });

let number=prompt("Número del contacto: ");
const text = prompt("Mensaje a enviar: ");

// Dar de alta clientes
const client = new Client({
    authStrategy: new LocalAuth()
});

// Notificar si hay un error al momento de restaurar una sesión
client.on('auth_failure', msg => {
    console.error('Restauración de la sesión sin éxito, borrar carpeta .wwebjs_auth', msg);
});


//Generar código qr
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
  });

  client.on('ready', () => {
    console.log('Mensaje enviado');
   
    // Delay para mandar mensaje después de 10 segundos
    setTimeout(()=>{
     // Mandar mensaje si el número ingresado es correcto        
          const chatId =+"521" +number+"@c.us";
            // Mandar mensaje
            client.sendMessage(chatId, text);
            logger.write(`Mensaje enviado correctamente: ${number}\n`);
        },1000);//delay para evitar mandar el mensaje al mismo tiempo
    }); 

client.on('message', async msg => {
    if (msg.body === '!info') {
        msg.reply('Este es un programa hecho en Javascript');
        const nameChat=(await msg.getChat()).name;
        console.log(`El usuario: ${nameChat} ha solicitado más información`);
    } 
    
    else if (msg.body === '!hola') {
        client.sendMessage(msg.from, 'Hola te habla un bot');
        const nameChat=(await msg.getChat()).name;
        console.log(`El usuario: ${nameChat} ha mandado hola`);
    }
});

client.on('disconnected', (reason) => {
    console.log('El número registrado para mandar mensajes se ha desconectado, favor de cerrar el ejecutable y volver a escanear el código QR', reason);
});


client.initialize();