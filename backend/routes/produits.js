const express = require("express")
const { ShowProducts, ShowSpecificProduct } = require("../config/databaseSupa")
const Sessions = require("../middleware/session-cart")
const jwt = require("jsonwebtoken")

const produitR = express.Router()
const cacheP = {}
const expirationt = 1000 * 60

produitR.use(express.urlencoded({ extended: true }))
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

produitR.post("/Produit/acheter", (req, res) => {
    const { produitID, qte } = req.body

    const cart = req.cart

    const index = cart.findIndex(i => i.id === produitID)

    if (index > -1) {
        if (cart[index].qte > 100) {
            res.json({ success: false, message: "Impossible de dépasser 100 produit. Contactez nous pour plus d'info!" })
        }
        cart[index].qte += qte
    } else {
        cart.push({ id: produitID, qte: qte })
    }

    res.cookie("cart", JSON.stringify(cart), {
        maxAge: 1000 * 60 * 60,
        sameSite: "lax",
        path: "/"
    })
    console.log(req.cart)

    res.json({ success: true, message: "Ajouté!" })
})

produitR.post("/Produit/Achat-Confirmation", (req, res) => {
    if (!req.cookies.cart) {
        console.log("here")
        return res.status(400).json({ error: "Erreur" })
    }

    res.json({ success : true})
})

/*produitR.get("/Produit/Achat", (req, res) => {
    console.log("here")
    console.log(req.cookies.cart)
    //const cartlist = JSON.parse(req.cookies.cart)
    res.render("pages/confirmation", { cartlist })
})*/
module.exports = { produitR }