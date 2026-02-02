const { rateLimit } = require("express-rate-limit")

function admin(req, res, next) {
    if (!req.session?.isAdmin) {
        return res.redirect("/Ad/Login")
    }

    next()
}

const RateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 2,
    standardHeaders: true,
    skip: (req, res) => {
        if(req.session?.isAdmin) return true
    },
    
    handler: (req, res) => {
        const errors = ["Tros de requetes attendez une minute"]
        const isLimited = true
        res.status(429).render("admin", { errors, isLimited })
    }
})

module.exports = { admin, RateLimit }