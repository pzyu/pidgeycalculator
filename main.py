import math

from telegram.ext import Updater
updater = Updater(token='243219972:AAHy2n37oj3OA8i6hYEDSpWvpPRolscQlXc')

dispatcher = updater.dispatcher

import logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

def start(bot, update):
	bot.sendMessage(chat_id=update.message.chat_id, text="Hello, I'm your Pidgey calculator. To start, type in /calculate. You can stop the operation by typing in /exit at any time")

from telegram.ext import MessageHandler, Filters
from telegram.ext import CommandHandler
start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)

def caps(bot, update, args):
	if not args:
		print 'no text'
		bot.sendMessage(chat_id=update.message.chat_id, text="Please enter a text following the command eg. /caps apple")
		return 
	text_caps = ' '.join(args).upper()
	bot.sendMessage(chat_id=update.message.chat_id, text=text_caps)

caps_handler = CommandHandler('caps', caps, pass_args=True)
dispatcher.add_handler(caps_handler)

mode = "idle"
num_pidgeys = 0
num_candies = 0

def calculate(bot, update, args):
	#if not args:
	#	bot.sendMessage(chat_id=update.message.chat_id, text="Please enter the command properly")
	global mode
	mode = "get_pidgey"
	bot.sendMessage(chat_id=update.message.chat_id, text="First, tell me how many Pidgeys you have")

def exit(bot, update):
	global mode
	mode = "idle"
	bot.sendMessage(chat_id=update.message.chat_id, text="Tell me what to do next")

def echo(bot, update):
	global mode
	print update.message.text
	print mode
	if mode == "get_pidgey":
		getNumPidgeys(bot, update)
	elif mode == "get_candy": 
		getNumCandies(bot, update)
	#elif mode == "idle": 
		#bot.sendMessage(chat_id=update.message.chat_id, text="Hello, I'm your Pidgey calculator. To start, type in /calculate. You can stop the operation by typing in /exit at any time")

def getNumPidgeys(bot, update):
	if update.message.text.isdigit():
		global num_pidgeys
		global mode
		num_pidgeys = int(update.message.text)
		bot.sendMessage(chat_id=update.message.chat_id, text="Alright, you have " + str(num_pidgeys) + " Pidgeys")
		mode = "get_candy"
		bot.sendMessage(chat_id=update.message.chat_id, text="Now, tell me how many candies you have")
	else:
		bot.sendMessage(chat_id=update.message.chat_id, text="Please enter a number")

def getNumCandies(bot, update):
	if update.message.text.isdigit():
		global num_candies
		global num_pidgeys
		global mode
		num_candies = int(update.message.text)
		if (num_candies >= 12):
			bot.sendMessage(chat_id=update.message.chat_id, text="Alright, you have " + str(num_candies) + " candies")
			mode = "calculate"
			bot.sendMessage(chat_id=update.message.chat_id, text="Let me calculate that for you")
			findExp(bot, update)
		else:
			bot.sendMessage(chat_id=update.message.chat_id, text="You can't evolve any of them!")
			exit(bot, update)
	else:
		bot.sendMessage(chat_id=update.message.chat_id, text="Please enter a number")

def findExp(bot, update): 
	global num_pidgeys, num_candies, mode
	# max user can evolve
	max_evolve = math.floor(num_candies / 12) 					
	# if user has less than max,
	if num_pidgeys < max_evolve:
		num_evolve = num_pidgeys
	else: # otherwise user can evolve maximum 
		num_evolve = max_evolve
	num_remain = num_candies - num_evolve * 12
	num_pidgeys_left = num_pidgeys - num_evolve
	bot.sendMessage(chat_id=update.message.chat_id, text="You can evolve " + str(int(num_evolve)) + " Pidgeys")
	bot.sendMessage(chat_id=update.message.chat_id, text="You will have " + str(int(num_pidgeys_left)) + " Pidgeys and " + str(int(num_remain)) + " candies left")
	bot.sendMessage(chat_id=update.message.chat_id, text="You will earn " + str(int(num_evolve * 500)) + " exp without lucky egg and " + str(int(num_evolve * 1000)) + " exp with lucky egg!")
	mode = "idle"


echo_handler = MessageHandler([Filters.text], echo)
dispatcher.add_handler(echo_handler)

calc_handler = CommandHandler('calculate', calculate, pass_args=True)
exit_handler = CommandHandler('exit', exit)
dispatcher.add_handler(calc_handler)
dispatcher.add_handler(exit_handler)

updater.start_polling()