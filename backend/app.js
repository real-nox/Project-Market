const cookieparser = require("cookie-parser")
const { randomUUID } = require("crypto")
const express = require("express")
const path = require("path")

const app = express()

const { AdminR } = require("./routes/admin")
const { produitR } = require("./routes/produits")
const Sessions = require("./middleware/session")

app.set("views", path.join(__dirname, "../frontend/views"))
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "../frontend/public")))
app.use(express.urlencoded({ extended: true }))
app.use(cookieparser())

app.use(Sessions)

//Router
app.use(AdminR)
app.use(produitR)

app.get("/", (req, res) => {
    res.render("main")
})

app.listen(3000, async () => {
    console.log("I'm Alive")
})