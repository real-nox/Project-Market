const express = require("express")
const path = require("path")

const app = express()

const { AdminR } = require("./routes/admin")

app.set("views", path.join(__dirname, "../frontend/views"))
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "../frontend/public")))
app.use(express.urlencoded({ extended: true }))


//Router
app.use(AdminR)

app.get("/", (req, res) => {
    res.render("main")
})

app.get("/Produits", (req, res) => {
    res.render("listeproduits")
})

app.listen(3000, async () => {
    console.log("I'm Alive")
})