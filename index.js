const TelegramApi = require('node-telegram-bot-api')
const firebase = require('firebase/compat/app')
require('firebase/compat/firestore')
const token = '6264616609:AAFad1S00nww5G2zxJeQcmIOHK23BWpa9OQ'
const bot = new TelegramApi(token, { polling: true })

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyBiyso24Itfw9XDAjMFveoXwZBDwJiYVzk',
	authDomain: 'telegram-11ad1.firebaseapp.com',
	projectId: 'telegram-11ad1',
	storageBucket: 'telegram-11ad1.appspot.com',
	messagingSenderId: '460490875535',
	appId: '1:460490875535:web:29f9bee877ddf3643d46fa',
	measurementId: 'G-39NWCJJJSX',
})

const firestore = firebaseApp.firestore()

const addData = async (chatId, userName, userFirstName, userLastName) => {
	chatId = chatId.toString()
	firestore.collection('users').doc(chatId).set({
		userName: userName,
		userFirstName: userFirstName,
		userLastName: userLastName,
		buttonSolo: false,
		buttonAssist: false,
		text: [],
	})
}
const newData = async (chatId, buttonSolo, buttonAssist) => {
	chatId = chatId.toString()
	if (buttonSolo)
		firestore.collection('users').doc(chatId).update({
			buttonSolo: true,
		})
	if (buttonAssist)
		firestore.collection('users').doc(chatId).update({
			buttonAssist: true,
		})
}
const newText = async (chatId, text) => {
	chatId = chatId.toString()
	firestore
		.collection('users')
		.doc(chatId)
		.set(
			{
				text: firebase.firestore.FieldValue.arrayUnion(text),
			},
			{ merge: true }
		)
}
const getData = async chatId => {
	chatId = chatId.toString()
	return firestore
		.collection('users')
		.doc(chatId)
		.get()
		.then(doc => {
			return doc.data()
		})
}

const buttonOpt = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[{ text: 'Самостоятельный онлайн-шопинг', callback_data: '1' }],
			[{ text: 'Шопинг-ассистент', callback_data: '2' }],
		],
	}),
}

const start = async () => {
	let startFlag = false
	let startTimeOut = false
	let dataFlag = false
	bot.setMyCommands([{ command: '/start', description: 'запуск бота' }])

	bot.on('message', async msg => {
		dataFlag = false
		const chatId = msg.chat.id
		const userName = msg.chat.username
		const userFirstName = msg.chat.first_name || 'не указанно'
		const userLastName = msg.chat.last_name || 'не указанно'
		const text = msg.text

		if (text === '/start') {
			startFlag = true
			await addData(chatId, userName, userFirstName, userLastName)
			setTimeout(() => {
				if (startFlag) {
					bot.sendMessage(
						chatId,
						`Никак не можешь определиться с 🛍️?
Загляни на мой канал, где ты найдешь вдохновение для будущих покупок, анонсы больших сэйлов и информацию про отправку сборных грузов (https://t.me/k2buyer)`
					)
				}
			}, 600000)
			bot.sendMessage(
				chatId,
				`Привет!
Меня зовут Кристина, я байер, живу в Италии и занимаюсь отправкой посылок в Россию и по всему миру из бутиков и аутлетов Европы 🧡

В этом боте можно ознакомиться с каталогом и списком сайтов для шопинга (самостоятельный шопинг) или оставить заявку на поиск определённой позиции (шопинг-ассистент)`,
				buttonOpt
			)
		}
		//const user = await getData(chatId)
		if (text !== '/start') {
			newText(chatId, text)
			bot.sendMessage(
				chatId,
				`Спасибо! Я уже работаю над заказом и скоро вернусь с ответом 🏃🏼‍♀️🏎️
А пока загляни на мой канал, где ты найдешь вдохновение для будущих покупок, анонсы больших сэйлов и информацию про отправку сборных грузов (https://t.me/k2buyer)`
			)
			bot.sendMessage(
				chatId,
				`Фото/скриншот нужной позиции можно прислать сюда: @zakaz_k2u 

Это ускорит время обработки заказа и очень поможет мне в поиске ❤️`
			)
		}
	})

	bot.on('callback_query', async msg => {
		startFlag = false
		const data = msg.data
		const chatId = msg.message.chat.id

		// bot.editMessageReplyMarkup(chatId)
		if (data === '1') {
			newData(chatId, true, false)
			bot.sendMessage(
				chatId,
				`Выбирай самостоятельно всё, что хочешь, на любимых маркетплейсах онлайн, добавляй товары в корзину и присылай скриншот сюда ⬇️
https://t.me/zakaz_k2u
Не забудь включить VPN 😉`
			)
			bot.sendMessage(
				chatId,
				`Список сайтов маркетплейсов и брендов: 
https://t.me/k2buyer/686`
			)
		}

		if (data === '2') {
			dataFlag = true
			newData(chatId, false, true)
			bot.sendMessage(
				chatId,
				`Опиши максимально детально свой запрос: наименование, бренд, цвет, размер одежды/обуви`
			)
			setTimeout(() => {
				if (dataFlag) {
					bot.sendMessage(
						chatId,
						`Никак не можешь определиться с 🛍️?
Загляни на мой канал, где ты найдешь вдохновение для будущих покупок, анонсы больших сэйлов и информацию про отправку сборных грузов (https://t.me/k2buyer)`
					)
				}
			}, 600000)
		}

		if (!startTimeOut) {
			startTimeOut = true
			setTimeout(async () => {
				const user = await getData(chatId)
				if (user.buttonAssist && user.buttonSolo) {
					startTimeOut = false
					return bot.sendMessage(
						chatId,
						`Привет! Не забудь подписаться на
		наш канал (https://t.me/k2buyer) ❤️`
					)
				} else {
					if (user.buttonSolo) {
						startTimeOut = false
						bot.sendMessage(
							chatId,
							`Никак не можешь определиться с 🛍️?
Загляни на мой канал, где ты найдешь вдохновение для будущих покупок, анонсы больших сэйлов и информацию про отправку сборных грузов (https://t.me/k2buyer)`
						)
					}
					if (user.buttonAssist) {
						startTimeOut = false
						bot.sendMessage(
							chatId,
							`Никак не можешь определиться с 🛍️?
Загляни на мой канал, где ты найдешь вдохновение для будущих покупок, анонсы больших сэйлов и информацию про отправку сборных грузов (https://t.me/k2buyer)`
						)
					}
				}
			}, 259200000)
		}
	})
}

start()
