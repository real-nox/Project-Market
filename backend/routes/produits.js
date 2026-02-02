const express = require("express")
const { ShowProducts, ShowSpecificProduct, FindCli, ClientAdd, Order } = require("../config/databaseSupa")
const Sessions = require("../middleware/session-cart")

const produitR = express.Router()
const cacheP = {}
const expirationt = 1000 * 60

produitR.use(express.urlencoded({ extended: true }))
produitR.use(Sessions)

produitR.use((req, res, next) => {
    res.locals.produit = req.produit || []

    res.locals.error = req.error || []
    next()
})

produitR.get("/Produits", (req, res) => {
    res.render("listeproduits")
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
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60
    })
    res.json({ success: true, message: "Ajouté!" })
})

produitR.post("/Produit/Remove", (req, res) => {
    const { produitID } = req.body

    if (!produitID) {
        return res.json({ success: false, message: "ProduitID manquant" })
    }

    const cart = req.cart

    const index = cart.findIndex(i => i.id === produitID)

    if (index > -1) {
        cart.splice(index, 1)
        res.cookie("cart", JSON.stringify(cart), {
            sameSite: "lax",
            path: "/",
            maxAge: 1000 * 60 * 60
        })
        return res.json({ success: true, message: "Retiré!" })
    } else {
        return res.json({ success: false, message: "Erreur!" })
    }
})

produitR.post("/Produit/Update", (req, res) => {
    const { produitID, qte } = req.body

    const cart = req.cart

    const index = cart.findIndex(i => i.id === produitID)

    if (index > -1) {
        if (cart[index].qte > 100) {
            res.json({ success: false, message: "Impossible de dépasser 100 produit. Contactez nous pour plus d'info!" })
        }
        cart[index].qte += qte

        res.cookie("cart", JSON.stringify(cart), {
            sameSite: "lax",
            path: "/",
            maxAge: 1000 * 60 * 60
        })
        return res.json({ success: true, message: "Modifier!" })
    } else {
        cart.push({ id: produitID, qte: qte })

        res.cookie("cart", JSON.stringify(cart), {
            sameSite: "lax",
            path: "/",
            maxAge: 1000 * 60 * 60
        })
        return res.json({ success: true, message: "Modifier!" })
    }
})

produitR.post("/Produit/Achat-Confirmation", (req, res) => {
    if (!req.cookies.cart) {
        console.log("here")
        return res.status(400).json({ error: "Erreur" })
    }

    res.json({ success: true })
})

produitR.get("/Produit/Achat/Confirmation", (req, res) => {
    if (!req.cookies.cart) {
        console.log("here")
        return res.status(400).json({ error: "Erreur" })
    }

    const cartlist = JSON.parse(req.cookies.cart)

    res.render("pages/confirmation", { cartlist })
})

//Confirmation

produitR.post("/Produit/Achat/Confirmation", async (req, res) => {
    try {
        let { nom, prenom, numt, ville, adresse } = req.body
        let error = []

        if (!nom || !prenom || typeof (nom) != "string" || typeof (prenom) != "string") {
            error = ["Completez vos information!"]
            return res.render("pages/confirmation", { error })
        }

        nom = nom.toLowerCase()
        prenom = prenom.toLowerCase()

        const cartlist = JSON.parse(req.cookies.cart)

        if (!cartlist) {
            console.log("here")
            return res.status(400).json({ error: "Erreur" })
        }

        const isClient = await FindCli(nom, prenom)

        if (isClient.length) {
            console.log(isClient)
            const clientID = isClient[0].id

            cartlist.forEach(async produit => {
                await Order(produit.id, clientID, produit.qte)
            })

            res.clearCookie("cart")
            return res.redirect("/")
        } else {
            if (!numt || !ville || !adresse) {
                error = ["Completez vos information!"]
                res.render("pages/confirmation", { error })
            }

            const infoC = { nom, prenom, numt, ville, adresse }
            const newClient = await ClientAdd(infoC)
            const newclientID = newClient[0].id

            console.log(newClient)
            cartlist.forEach(async produit => {
                await Order(produit.id, newclientID, produit.qte)
            })

            res.clearCookie("cart")
            return res.redirect("/")
        }
    } catch (err) {
        console.log(err)
    }
})
module.exports = { produitR }