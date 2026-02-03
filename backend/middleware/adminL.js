function admin(req, res, next) {
    if (!req.session?.isAdmin) {
        return res.redirect("/Ad/Login")
    }

    next()
}

module.exports = { admin }