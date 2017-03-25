var token = '245201218:AAFfTLEzf79bzqDoyQh1pN2cNyQhJ_hp62I';

var Bot = require('node-telegram-bot-api'),
	bot = new Bot(token, { polling: true });

console.log('bot server started...');

var mode = "idle";
var total_pidgeys = 0;
var total_candies = 0;

var info = [
	"Good choice, Gek Poh.\n\nWhat do you wish to learn about scams?",
	"There are many different types of scams, the most common ones today are:\n" + 
	"Impersonation scam\nInvestment scam\nInheritance scam\nKidnap scam\nLottery scam\nOnline purchase scam" +
	"\n\nDo you wish to learn more about any of them?",
	"Impersonation scams happen when you receive an unexpected phone call from someone purporting to be a government official, "+
	"such as a police officer, investigation officer, or court official, be wary as this could be a scam call." +
	"\n\nWhat to look out for:\nBe wary of calls from people claiming to be officials.\nKnow that official agencies would " +
	"not ask you to make payments over the phone.\n\n" +
	"How to protect yourself:\nDo not follow the caller's instructions\nRefrain from giving bank details, credit card numbers, " +
	"OTP codes from tokens or passport numbers to strangers over the phone\nCall '999' if you require further assistance."
];

var emergency = [
	"Do not panic, Gek Poh. Remember to stay calm and think straight, now tell me what has happened.",
	"Alright, don't worry. Did the man mention your granddaughter's name or describe how she looks?" + 
	"\n\nHave you tried contacting your granddaughter? If she has not replied, think about where she normally is at this time of the day " +
	"Is she usually in school, or having tuition classes, and that is why she cannot pick up the phone?",
	"Not to worry, this sounds like a kidnap scam call. These 'kidnappers' usually have someone screaming or crying in the background " +
	"for effect, but provide very little details about the person\n\n" + 
	"Please continue to try contacting your granddaughter, you can try calling the school to confirm her safety and whereabouts. " +
	"If she is still uncontactable after a few hours, please call the Police at '999' to make a report."
];

var scams = [
	"Hello Gek Poh, please send me the phone number or email address you would like to check.",
	"Yes, this is indeed a scam! This number has been reported 34 times as an impersonation scam. Please no not follow their instructions or " +
	"give out your personal information. \n\nDo you wish more about impersonation scams?\n\nBe Alert. Be Safe. Be Calm.\nHaven"
]

var infoIndex = 0;
var emergencyIndex = 0;
var scamsIndex = 0;

bot.onText(/^\/start.*|\/help.*$/, function(msg, match) {
	console.log(msg);
	var name = match[1];
	messageIndex = 0;
	bot.sendMessage(msg.chat.id, "Hello Gek Poh,\n\nMy name is Haven, and I will be your assistant to learn more about scams!" + 
		"\n\nThere are a few commands that you can try:" + 
		"\n\nFeel like learning more about scams and their potential dangers? Type in /info to find out more." + 
		"\n\nIf you're caught in an emergency situation, type in /emergency for me to assist you." + 
		"\n\nNot sure if the phone call you received was legitimate? I can help you do a check when you type in /check" + 
		"\n\nFinally, you can stop me by typing in /quit").then(function () {
    	// reply sent!
  	});
});

bot.onText(/^\/quit.*$/, function(msg, match) {
	if (mode != "idle") {
		mode = "idle"
		bot.sendMessage(msg.chat.id, "Thank you, and have a nice day!");
	}
});

bot.onText(/^\/info.*$/, function(msg, match) {
	mode = "info_mode"
	infoIndex = 0;
	bot.sendMessage(msg.chat.id, "");
});

bot.onText(/^\/emergency.*$/, function(msg, match) {
	mode = "emergency_mode"
	emergencyIndex = 0;
	bot.sendMessage(msg.chat.id, "");
});

bot.onText(/^\/check.*$/, function(msg, match) {
	mode = "check_mode"
	checkIndex = 0;
	bot.sendMessage(msg.chat.id, "");
});

bot.onText(/.*/, function(msg, match) {
	console.log("From [" + msg.from.first_name + "]: " + msg.text);
	if (mode == "info_mode" && msg.text != "/info") {
		bot.sendMessage(msg.chat.id, information[infoIndex]);
		infoIndex++;
		if (infoIndex > information.length - 1) {
			mode == "idle";
		}
	} else if (mode == "emergency") {
		bot.sendMessage(msg.chat.id, emergency[emergencyIndex]);
		emergencyIndex++;
		if (emergencyIndex > emergency.length - 1) {
			mode == "idle";
		}
	} else if (mode == "check") {
		bot.sendMessage(msg.chat.id, check[checkIndex]);
		checkIndex++;
		if (checkIndex > check.length - 1) {
			mode == "idle";
		}
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
