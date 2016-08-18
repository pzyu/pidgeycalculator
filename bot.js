var token = '245201218:AAFfTLEzf79bzqDoyQh1pN2cNyQhJ_hp62I';

var Bot = require('node-telegram-bot-api'),
	bot = new Bot(token, { polling: true });

console.log('bot server started...');

bot.onText(/^\/start$/, function(msg, match) {
	var name = match[1];
	bot.sendMessage(msg.chat.id, "Hello, I'm your Pidgey calculator. To start, type in /calculate. You can stop the operation by typing in /exit at any time").then(function () {
    	// reply sent!
  	});
});