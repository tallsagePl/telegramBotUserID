const TelegramApi = require('node-telegram-bot-api')

const token = '5745898348:AAG8Hlg4acQ9I_AVBa4U_mFlI2iR7WSkDRg'

const bot = new TelegramApi(token, { polling: true })

const buttonOpt = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[{ text: 'Самостоятельный онлайн-шопинг', callback_data: '1' }],
			[{ text: 'Шопинг-ассистент', callback_data: '2' }],
		],
	}),
}

const buttonOptOne = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[{ text: 'первый вариант', callback_data: '3' }],
			[{ text: 'второй вариант', callback_data: '4' }],
		],
	}),
}

const buttonOptScnd = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[{ text: 'третий вариант', callback_data: '5' }],
			[{ text: 'четвертый вариант', callback_data: '6' }],
		],
	}),
}

const start = () => {
	bot.setMyCommands([{ command: '/start', description: 'запуск бота' }])

	bot.on('message', msg => {
		const userId = msg.chat.id
		const userName = msg.chat.username
		const userFirstName = msg.chat.first_name || 'не указанно'
		const userLastName = msg.chat.last_name || 'не указанно'

		if (msg.text === '/start') {
			return bot.sendMessage(
				msg.chat.id,
				`Привет! 
На связи K2U Delivery 🧡 
С нами ты сможешь оформить заказ и доставку оригиналов — одежда, обувь, сумки, украшения — из бутиков брендов и аутлетов Европы`,
				buttonOpt
			)
		}
	})

	bot.on('callback_query', async msg => {
		const data = msg.data
		const chatId = msg.message.chat.id

		if (data === '1') {
			console.log(123)
			return bot.sendMessage(
				chatId,
				'Продолжайте самостоятельный шопинг',
				buttonOptOne
			)
		}
		if (data === '2') {
			return bot.sendMessage(chatId, 'Ваш шопинг-ассистент', buttonOptScnd)
		}
	})
}

start()
