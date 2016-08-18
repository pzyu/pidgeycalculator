from telegram.ext import Updater
updater = Updater(token='243219972:AAHy2n37oj3OA8i6hYEDSpWvpPRolscQlXc')

dispatcher = updater.dispatcher

import logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

def start(bot, update):
	bot.sendMessage(chat_id=update.message.chat_id, text="My name is Ng Yan Xin, I am super cute")

from telegram.ext import CommandHandler
start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)

def echo(bot, update):
	bot.sendMessage(chat_id=update.message.chat_id, text=update.message.text)

from telegram.ext import MessageHandler, Filters
echo_handler = MessageHandler([Filters.text], echo)
dispatcher.add_handler(echo_handler)

def caps(bot, update, args):
	if not args:
		print 'no text'
		bot.sendMessage(chat_id=update.message.chat_id, text="Please enter a text following the command eg. /caps apple")
		return 
	text_caps = ' '.join(args).upper()
	bot.sendMessage(chat_id=update.message.chat_id, text=text_caps)

caps_handler = CommandHandler('caps', caps, pass_args=True)
dispatcher.add_handler(caps_handler)

def calculate(bot, update, args):
	if not args:
		bot.sendMessage(chat_id=update.message.chat_id, text="Please enter the command properly")
	

updater.start_polling()