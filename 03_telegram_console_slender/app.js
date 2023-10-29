const TelegramBot = require('node-telegram-bot-api');
const { program } = require('commander');
const fs = require('fs');

const token = '6274922533:AAEOtD5GBPtSxiC2TSqN0D5Z8EnAg595bbw'; // Bot token
const bot = new TelegramBot(token, { polling: true });

let messages = []; // Array store message details

// Look for last msg to find chatId
if (fs.existsSync('messages.json')) {
    messages = JSON.parse(fs.readFileSync('messages.json'));
}

bot.on('message', (msg) => {
    const messageInfo = {
        chatId: msg.chat.id,
        messageId: msg.message_id,
        text: msg.text,
        date: new Date(msg.date * 1000).toISOString(), // UNIX time to ISO time
    };

    messages.push(messageInfo);

    // Save messages after /start
    if (msg.text === '/start') {
        fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
    }

});

program
    .command('send-message <message>')
    .description('Send a message via the Telegram bot')
    .action((message) => {
        // Look for the latest chatId in messages.json
        const latestChatId = messages.length > 0 ? messages[messages.length - 1].chatId : '357091746'; // If no chatID => standard chatId with owner(ETHERNXL) 
                                                                                                       // Try /start command in chat and try to execute command it will reset the chatID or just input in manually
        bot.sendMessage(latestChatId, message).then(() => {
            setTimeout(() => {
                process.exit(); // Terminate the process after delay
            }, 1000); // Delay 1s 
        });
    });

program
    .command('send-photo <path>')
    .description('Send a local photo via the Telegram bot')
    .action((path) => {
        // Look for the latest chatId in messages.json
        const latestChatId = messages.length > 0 ? messages[messages.length - 1].chatId : '357091746'; // If no chatID => standard chatId with owner(ETHERNXL) 
                                                                                                       // Try /start command in chat and try to execute command it will reset the chatID or just input in manually
        // Photo 
        const photo = fs.createReadStream(path);

        bot.sendPhoto(latestChatId, photo).then(() => {
            setTimeout(() => {
                process.exit(); // Terminate the process after a delay
            }, 1000); // Delay 1s
        });
    });

program.parse(process.argv);