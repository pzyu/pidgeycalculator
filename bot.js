var token = '245201218:AAFfTLEzf79bzqDoyQh1pN2cNyQhJ_hp62I';

var Bot = require('node-telegram-bot-api'),
	bot = new Bot(token, { polling: true });

console.log('bot server started...');

var mode = "idle";
var total_pidgeys = 0;
var total_candies = 0;

bot.onText(/^\/help$/, function(msg, match) {
	var name = match[1];
	bot.sendMessage(msg.chat.id, "Hello " + msg.from.first_name + ", I'm your Pidgey calculator. To start, type in /pidgey. You can stop the operation by sending /exit at any time").then(function () {
    	// reply sent!
  	});
});

bot.onText(/^\/pidgey$/, function(msg, match) {
	mode = "get_pidgey"
	bot.sendMessage(msg.chat.id, "First, tell me how many Pidgeys you have");
});

bot.onText(/.*/, function(msg, match) {
	console.log(msg.text);
	if (mode == "get_pidgey" && msg.text != "/pidgey") {
		getPidgey(msg);
	} else if (mode == "get_candy") {
		getCandy(msg);
	}
});

function getPidgey(msg) {
	var isNum = /^\d+$/.test(msg.text);
	total_pidgeys = parseInt(msg.text);
	console.log(isNum);
	if (!isNum) {
		bot.sendMessage(msg.chat.id, "Please enter a valid number");
	} else {
		bot.sendMessage(msg.chat.id, "Alright, you have " + total_pidgeys + " Pidgeys");
		setTimeout(function() {
			bot.sendMessage(msg.chat.id, "Now tell me, how many candies do you have?");
			mode = "get_candy";
		}, 100);
	}
};

function getCandy(msg) {
	var isNum = /^\d+$/.test(msg.text);
	total_candies = parseInt(msg.text);
	if (!isNum) {
		bot.sendMessage(msg.chat.id, "Please enter a valid number");
	} else {
		if (total_candies < 12) {
			bot.sendMessage(msg.chat.id, "You can't evolve any of them!");
			setTimeout(function() {
				bot.sendMessage(msg.chat.id, "Please try again, or go away using the /exit command");
		}, 100);
		} else {
			bot.sendMessage(msg.chat.id, "So you have " + total_candies + " candies");
			setTimeout(function() {
				bot.sendMessage(msg.chat.id, "Let me calculate that for you");
				calculate(msg);
			}, 100);
		}
	}
};

function calculate(msg) {
	var can_evolve = 0;
	var max_evolve = Math.floor(total_candies / 12);
	if (total_pidgeys < max_evolve) {
		can_evolve = total_pidgeys;
	} else {
		can_evolve = max_evolve;
	}
	var candies_left = ((total_candies - can_evolve * 12) == 0) ? "no" : total_candies - can_evolve * 12;
	var pidgeys_left = ((total_pidgeys - can_evolve) == 0) ? "no" : total_pidgeys - can_evolve;
	bot.sendMessage(msg.chat.id, "You can evolve " + can_evolve + " Pidgeys");
	setTimeout(function() {
		bot.sendMessage(msg.chat.id, "You will have " + pidgeys_left + " Pidgeys and " + candies_left + " candies left");
	}, 100);
	setTimeout(function() {
		bot.sendMessage(msg.chat.id, "You will earn " + can_evolve * 500 + " exp without lucky egg and " + can_evolve * 1000 + " exp with lucky egg!");
	}, 200);
	mode = "idle";
};