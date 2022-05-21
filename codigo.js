// library to use whatsapp web
const { Client, LocalAuth } = require('whatsapp-web.js');

// library to use prompt inside console
const prompt = require('prompt-sync')();

// library to generate qr corde
const qrcode = require('qrcode-terminal');

// library to create a .txt file
var fs = require('fs');
var logger = fs.createWriteStream('Response.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  });

let number=prompt("Número del contacto: ");
const text = prompt("Mensaje a enviar: ");


const client = new Client({
    authStrategy: new LocalAuth()
});

// Notify if there's an error in the authentication process
client.on('auth_failure', msg => {
    console.error('Authentication failure', msg);
});


client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
  });

  client.on('ready', () => {
    console.log('Message sent');
   
    
    setTimeout(()=>{     
          const chatId =+"521" +number+"@c.us";
            // Send message
            client.sendMessage(chatId, text);
            logger.write(`Message sent to : ${number}\n`);
        },1000);// Delay of 10 seconds
    }); 

client.on('message', async msg => {
    if (msg.body === '!info') {
        msg.reply('This is a program made in Javascript');
        const nameChat=(await msg.getChat()).name;
        console.log(`The user: ${nameChat} wants more information`);
    } 
    
    else if (msg.body === '!hello') {
        client.sendMessage(msg.from, 'Hello you are talking to a chatbot');
        const nameChat=(await msg.getChat()).name;
        console.log(`The user: ${nameChat} said hello`);
    }
});

client.on('disconnected', (reason) => {
    console.log('The user has disconneted the session', reason);
});


client.initialize();
