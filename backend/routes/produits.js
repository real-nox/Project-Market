const express = require("express")
const { ShowProducts, ShowSpecificProduct } = require("../config/databaseSupa")
const Sessions = require("../middleware/session")

const produitR = express.Router()
const cacheP = {}
const expirationt = 1000 * 60

produitR.use(Sessions)

produitR.use((req, res, next) => {
    res.locals.produit = req.produit || []
    next()
})

produitR.get("/Produits", (req, res) => {
    res.render("listeproduits")
})

produitR.get("/Liste-Produits", async (req, res) => {
    const data = await ShowProducts()

    res.json(data)
})

produitR.get("/Produit/:id", async (req, res) => {
    const pro_id = req.params.id
    let produit

    if (cacheP[pro_id] && cacheP[pro_id].exp > Date.now()) {
        produit = cacheP[pro_id].data
        return res.render("pages/produit", { produit })
    }
    produit = await ShowSpecificProduct(pro_id)
    produit = produit[0]

    if (!produit)
        return res.status(404).send("unfound page")

    cacheP[pro_id] = {
        data: produit,
        exp: expirationt + Date.now()
    }
    res.render("pages/produit", { produit })
})

module.exports = { produitR }