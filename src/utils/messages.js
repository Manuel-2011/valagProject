const generateMessage = (username, text, to) => {
    return {
        username,
        text,
        to,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
}