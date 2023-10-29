const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const NodeCache = require('node-cache');

const token = '6841595114:AAG2ATUzfYybqeiYBB1eyfVOp1zmtg8HVnc';                   // Bot token
const apiPrivat = 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5'; //Api token Privat
const apiMono = 'https://api.monobank.ua/bank/currency'                       ;  //Api token Mono


const cache = new NodeCache(); // Create a new instance of the NodeCache

const bot = new TelegramBot(token, { polling: true });

const menusStack = [];

//Start menu with 1 button
const initialMenu = {
    reply_markup: {
        keyboard: [['Money exchange']],
        resize_keyboard: true,
        one_time_keyboard: false,
    },
};

//Submenu with 3 button
const submenu = {
    reply_markup: {
        keyboard: [['USD', 'EUR', 'Return']],
        resize_keyboard: true,
        one_time_keyboard: false,
    },
};

//Start the bot
bot.onText(/\/start/, (msg) => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to Exchange report bot!', initialMenu);
    menusStack.push(initialMenu);
});

bot.on('message', async (msg) => {
    let chatId = msg.chat.id;
    let text = msg.text;

    if (text === 'Money exchange') {
        bot.sendMessage(chatId, 'Select currency:', submenu);
        menusStack.push(submenu);
    } else if (text === 'USD' || text === 'EUR') {
        try {
            // Try to get data from the cache
            let currencyDataPrivat = cache.get('currencyDataPrivat'); 
            let currencyDataMono = cache.get('currencyDataMono');
            if (!currencyDataPrivat) {
                // If no data in cacge => fetch it from the API
                const responsePrivat = await axios.get(apiPrivat);
                currencyDataPrivat = responsePrivat.data;
                // Store the fetched data in cache for 300 seconds
                cache.set('currencyDataPrivat', currencyDataPrivat, 300);
            }
            if (!currencyDataMono) {
                // If no data in cacge => fetch it from the API
                const responseMono = await axios.get(apiMono);
                currencyDataMono = responseMono.data;
                // Store the fetched data in cache for 400 seconds
                cache.set('currencyDataMono', currencyDataMono, 400);
            }
            

            // Find currency in the cached data
            const selectedPrivat = currencyDataPrivat.find(currency => currency.ccy === text);
            const selectedMonoUsd = currencyDataMono.find(mono => mono.currencyCodeA === 840);// ISO code for USD
            const selectedMonoEur = currencyDataMono.find(mono => mono.currencyCodeA === 978);// ISO code for EUR

            
            if (selectedPrivat) {
                const buyRate = selectedPrivat.buy;
                const sellRate = selectedPrivat.sale;
                bot.sendMessage(chatId, `Current ${text} Exchange Rates in PrivatBank:\nBuy Rate: ${buyRate}\nSell Rate: ${sellRate}`);
            } else {
                bot.sendMessage(chatId, `Exchange rate data not available for ${text}.`);
            }
            if (selectedMonoUsd && text === 'USD') {
                const buyRateMono = selectedMonoUsd.rateBuy;
                const sellRateMono = selectedMonoUsd.rateSell;
                bot.sendMessage(chatId, `Current ${text} Exchange Rates in MonoBank:\nBuy Rate: ${buyRateMono}\nSell Rate: ${sellRateMono}`);
            } 
            else if(selectedMonoEur && text === 'EUR'){
                const buyRateMono = selectedMonoEur.rateBuy;
                const sellRateMono = selectedMonoEur.rateSell;
                bot.sendMessage(chatId, `Current ${text} Exchange Rates in MonoBank:\nBuy Rate: ${buyRateMono}\nSell Rate: ${sellRateMono}`);
            }
            else {
                bot.sendMessage(chatId, `Exchange rate data not available for ${text}.`);
            }
        } catch (error) {
            bot.sendMessage(chatId, `Error fetching ${text} exchange rates.`);
        }
    } else if (text === 'Return') {// If user wants to return to previous menu
        menusStack.pop();
        let previousMenu = menusStack[menusStack.length - 1];
        if (previousMenu) {
            bot.sendMessage(chatId, 'Select currency:', previousMenu);
        } else {
            bot.sendMessage(chatId, 'Welcome to Exchange report bot!', initialMenu);
            menusStack.push(initialMenu);
        }
    }
});