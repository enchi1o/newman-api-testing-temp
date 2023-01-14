const axios = require(`axios`)

const sendMessage = (title, subtitle, body) => {
    // Pass incoming webhook URL with environment variable `WEBHOOK_URL`.
    const WEBHOOK_URL = `${YOUR_GCHAT_WEBHOOK}`
    const widget = { textParagraph: { text: body } }
    axios.post(WEBHOOK_URL, {
        cards: [
            {
                header: {
                    title: title,
                    // subtitle: subtitle,
                    imageUrl: "https://user-images.githubusercontent.com/7853266/44114706-9c72dd08-9fd1-11e8-8d9d-6d9d651c75ad.png"
                },
                sections: [
                    {
                        widgets: [widget],
                    },
                ],
            },
        ],
    })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.error(err.toJSON())
        })
}

module.exports = {
    sendMessage
}