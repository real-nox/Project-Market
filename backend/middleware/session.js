function Sessions(req, res, next) {
    if (!req.cookies.sessionID) {
        const sessionId = randomUUID()
        res.cookie("sessionID", sessionId, { maxAge: 60 * 1000 * 60 })
        req.sessionID = sessionId
    } else {
        req.sessionID = req.cookies.sessionID
    }

    next()
}

module.exports = Sessions