const express = require("express")

const produitR = express.Router()

produitR.get("/Produits", (req, res) => {
    res.render("listeproduits")
})

produitR.get("/Liste-Produits", (req, res) => {
    console.log("recieved request")
})

module.exports = {produitR}