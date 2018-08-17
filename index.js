const worker = require('./fetch')
const config = require('./config')
const http = require('http')
const Bot = require('@kikinteractive/kik')

let context = {}

const bot = new Bot({
    username: config.username, // The username you gave BotsWorth on Kik 
    apiKey: config.apiKey, // The API Key you can find on your profile on dev.kik.com
    baseUrl: config.baseUrl // THIS IS YOUR WEBHOOK! make sure this maches the web tunnel or host you have running 
})

// Send the configuration to kik to update the bot with the information above
bot.updateBotConfiguration();


// The onTextMessage(message) handler. This is run everytime your bot gets a message. 
// The method takes a message object as a parameter.
bot.onTextMessage(message => {

    context.kik = true
    if (message.body.length > 7 || message.body.length < 7) {
        // Place the message in config perhaps?
        message.reply(message.body)
    } else {
        // Expecting incoming message to have a format of "XYZ 111" where XYZ is the dept code and 111 is the number
        context.dept = message.body.split(' ')[0].toUpperCase()
        context.number = message.body.split(' ')[1]
        console.log(context.dept + ' lala ' + context.number)

        worker(context, message.reply)
    }

    console.log(message)
});

// We want to set up our start chatting message. This will be the first message the user gets when they start 
// chatting with your bot. This message is only sent once. 
bot.onStartChattingMessage((message) => {
    bot.getUserProfile(message.from)
        .then((user) => {
            message.reply(`Hey ${user.firstName}! I'm your new echo bot. Send me a message and I'll send it right back!`);
        });
})

// Set up your server and start listening
let server = http
    .createServer(bot.incoming())
    .listen(process.env.PORT || 8000, err => {
        if (err) {
            return console.log('something bad happened', err)
        }

        console.log(`server is listening on ${process.env.PORT}`)
    });

// TODO: setup scheduled job, job.js?

module.exports = handler => {
    context.term = config.term
    worker(context, handler)
}