const axios = require('axios')
const config = require('./config')

// send("WOW", "aneeshmg", "b693daf4d84832b7aec6b942b992fdca2a740937b18d5025af9756250928f607")  

module.exports = (data, to, chatId) => {
    const url = 'https://api.kik.com/v1/message'
    const payload = {
        "messages": [
            {
                "body": data, 
                "to": to, 
                "type": "text", 
                "chatId": chatId
            }
        ]
    }
    const headers = { 
        'Authorization' : `Basic ${Buffer.from(`${config.username}:${config.apiKey}`).toString('base64')}` 
    }
    axios({
        url: url,
        method: 'post',
        headers: headers,
        data: payload
    }).then(e => console.log(e.data)).catch(e => console.log('FAILURE: ' + e))
}