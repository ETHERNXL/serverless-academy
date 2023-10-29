const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6790576666:AAGBbrcC_cfwX_pxE60CeQj4kp89ZOg_cOI'; // Bot token
const openWeatherApiKey = 'b3c6cf9029ba4f761fd24abccd7c37f1'; // Weather API token


const bot = new TelegramBot(token, { polling: true });

const initialMenu = {
    reply_markup: {
      keyboard: [['Forecast in Kyiv']],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
};

const submenu = {
    reply_markup: {
      keyboard: [['Every 3 Hours', 'Every 6 Hours']],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
};

bot.onText(/\/start/, (msg) => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to Weather report bot!', initialMenu);
});

bot.on('message', (msg) => {
    let chatId = msg.chat.id;
    let text = msg.text;
  
    if (text === 'Forecast in Kyiv') {
        bot.sendMessage(chatId, 'Select forecast interval:', submenu);
    } else if (text === 'Every 3 Hours') {
        getWeatherForecast(chatId, 3);
    } else if (text === 'Every 6 Hours') {
        getWeatherForecast(chatId, 6);
    }
});

function getWeatherForecast(chatId, intervalHours) {
    // Calculate the number of forecasts needed for the next 24 hours based on the interval
    let numberOfForecasts = Math.ceil(24 / intervalHours);

    //  OpenWeather API request for Kyiv weather forecast
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&units=metric&appid=${openWeatherApiKey}`)
        .then((response) => { //If get is successful
            let forecasts = response.data.list;
            //console.log(response.data.list);
            let message = `Weather forecast for Kyiv for the next 24 hours (every ${intervalHours} hours):\n`;

            let currentTime = new Date(); //Get current time

            for (let i = 0; i <= numberOfForecasts; i++) {
                let forecastTime = new Date(currentTime.getTime() + i * intervalHours * 3600000); //Convert local time to JS time
                let closestForecast = forecasts.reduce((acc, forecast) => {
                    //console.log(acc);
                    let forecastTimeDiff = Math.abs(forecastTime - new Date(forecast.dt * 1000));
                    let accTimeDiff = Math.abs(new Date(acc.dt * 1000) - forecastTime);
                    return forecastTimeDiff < accTimeDiff ? forecast : acc;
                });
                
                let temperature = closestForecast.main.temp;
                let description = closestForecast.weather[0].description;
                let timeString = forecastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Convert to readable time
                let dateString = forecastTime.toLocaleDateString();

                message += `${dateString} ${timeString}: ${description}, Temperature: ${temperature}°C\n`;
            }

            bot.sendMessage(chatId, message);
        })
        .catch((error) => { //If get is error
            console.error(error);
            bot.sendMessage(chatId, 'Failed to fetch weather data. Please try again later.');
        });
}