const { randomUUID } = require("crypto")

function Sessions_cart(req, res, next) {
    try {
        if (!req.cookies.sessionID) {
            res.clearCookie("cart")

            const sessionId = randomUUID()
            res.cookie("sessionID", sessionId, {
                httpsOnly: true,
                maxAge: 60 * 1000 * 60,
                sameSite: "lax",
                path: "/"
            })

            res.cookie("cart", JSON.stringify([]),
                {
                    maxAge: 60 * 1000 * 60,
                    sameSite: "lax",
                    path: "/"
                })

            req.sessionID = sessionId
            req.cart = []
        } else {
            req.sessionID = req.cookies.sessionID
            req.cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : []
        }

        next()
    } catch (err) {
        console.error(err);
    }
}

module.exports = Sessions_cart