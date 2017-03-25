var token = '245201218:AAFfTLEzf79bzqDoyQh1pN2cNyQhJ_hp62I';

var Bot = require('node-telegram-bot-api'),
	bot = new Bot(token, { polling: true });

console.log('bot server started...');

var mode = "idle";
var total_pidgeys = 0;
var total_candies = 0;

var messageArray = [
	"Good morning Gek Poh\nThis is Haven, and I'm here to help. Tell me, what do you wish to learn about scams?",
	"Dear Gek Poh\nYes, this is indeed a scam! This number has been reported 34 times in total as an impersonation scam." +  
	"Please do not follow their instructions or give out your personal information." + 
	"\nDo you wish to learn more about impersonation" + 
	"\nBe Alert. Be Safe. Be Calm. \nHaven"
];

var messageIndex = 0;

bot.onText(/^\/start.*|\/help.*$/, function(msg, match) {
	console.log(msg);
	var name = match[1];
	messageIndex = 0;
	mode = "get_pidgey";
	bot.sendMessage(msg.chat.id, "Hello Gek Poh,\n\nMy name is Haven, and I will be your assistant to learn more about scams" + 
		"\n\nThere are a few commands that you can try:" + 
		"\nFeel like learning more about scams and their potential dangers? Type in /info to find out more." + 
		"\nIf you're caught in an emergency situation, type in /emergency for me to assist you." + 
		"\nNot sure if the phone call you received was legitimate? I can help you do a check when you type in /check" + 
		"\nFinally, you can stop me by typing in /quit").then(function () {
    	// reply sent!
    	messageIndex++;
  	});
});

bot.onText(/^\/stop.*$/, function(msg, match) {
	if (mode != "idle") {
		mode = "idle"
		bot.sendMessage(msg.chat.id, "I'll just go away now");
	}
});

bot.onText(/^\/pidgey.*$/, function(msg, match) {
	mode = "get_pidgey"
	bot.sendMessage(msg.chat.id, "First, tell me how many Pidgeys you have");
});

bot.onText(/.*/, function(msg, match) {
	console.log("From [" + msg.from.first_name + "]: " + msg.text);
	if (mode == "get_pidgey" && msg.text != "/pidgey" && msg.text != "/pidgey@pidgeycalculator_bot") {
		//getPidgey(msg);
		console.log("Typing" + messageArray[messageIndex]);
		bot.sendMessage(msg.chat.id, messageArray[messageIndex]);
    	messageIndex++;
    	if(messageIndex > messageArray.length - 1) {
    		messageIndex = 0;
    	}
	} else if (mode == "get_candy") {
		getCandy(msg);
	}
});

function getPidgey(msg) {
	var isNum = /^\d+$/.test(msg.text);
	total_pidgeys = parseInt(msg.text);
	//console.log(isNum);
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
				bot.sendMessage(msg.chat.id, "Please try again, or stop using the /stop command");
		}, 100);
		} else {
			bot.sendMessage(msg.chat.id, "So you have " + total_candies + " candies");
			setTimeout(function() {
			// 	bot.sendMessage(msg.chat.id, "Let me calculate that for you");
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
	console.log("You can evolve " + can_evolve + " Pidgeys with " + pidgeys_left + " Pidgeys and " + candies_left + " candies left");
	console.log("This gives you " + can_evolve * 500 + " EXP without lucky egg and " + can_evolve * 1000 + " EXP with lucky egg!");

	bot.sendMessage(msg.chat.id, "You can evolve " + can_evolve + " Pidgeys with " + pidgeys_left + " Pidgeys and " + candies_left + " candies left");
	//setTimeout(function() {
	//	bot.sendMessage(msg.chat.id, "You will have " + pidgeys_left + " Pidgeys and " + candies_left + " candies left");
	//}, 200);
	setTimeout(function() {
		bot.sendMessage(msg.chat.id, "This gives you " + can_evolve * 500 + " EXP without lucky egg and " + can_evolve * 1000 + " EXP with lucky egg!");
	}, 300);
	mode = "idle";
};
