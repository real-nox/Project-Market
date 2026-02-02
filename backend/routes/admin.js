require("dotenv").config({ quiet: true })

const { FetchROWViaNameP, StoreIMGBucket, InsertProduct, UpdateOrder, ShowSpecificProduct, UpdateProduct, FetchROWViaIDP, RemoveProduct } = require("../config/databaseSupa")
const express = require("express")
const { genSaltSync, hashSync, compareSync } = require("bcrypt")
const { upload } = require("../middleware/upload")

const Sessions = require("../middleware/session-cart")
const { admin, RateLimit } = require("../middleware/adminL")
const session = require("express-session")

const AdminR = express.Router()

AdminR.use(Sessions)
AdminR.use(session({
    secret: process.env.SEC_SESSION,
    name: "admin.sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    }
}))

AdminR.use((req, res, next) => {
    res.locals.isAdmin = req.session?.isAdmin || false
    res.locals.isLimited = req.isLimited || false
    res.locals.errors = req.errors || []
    res.locals.success = req.success || []
    res.locals.produitinfo = req.produitinfo || []
    next()
})

AdminR.get("/Ad", admin, (req, res) => {
    res.redirect("/Ad/Me")
})

AdminR.get("/Ad/Login", (req, res) => {
    res.render("admin")
})

AdminR.get("/Ad/Me", admin, (req, res) => {
    const isAdmin = req.session.isAdmin
    res.render("admin", { isAdmin })
})

AdminR.get("/Ad/Logout", admin, (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("admin.sid")
        res.redirect("/Ad")
    })
})

AdminR.post("/Ad/Login", RateLimit, (req, res) => {
    let errors = []
    const info = req.body

    if (!info.password) {
        errors = ["Entrer le mot de passe!"]
        return res.render("admin", { errors })
    }

    const password = compareSync(info.password, process.env.PASSWORD)

    if (!password) {
        errors = ["Mot de passe est incorrect"]
        return res.render("admin", { errors })
    }

    req.session.isAdmin = true
    res.redirect("/Ad")
})

AdminR.get("/Ad/Produits", admin, (req, res) => {
    res.render("pages/adproduits")
})

AdminR.get("/Ad/Produits/Produit-ajouter", admin, (req, res) => {
    res.render("pages/ajout-p")
})

AdminR.post("/Ad/Produits/Produit-ajouter", admin, upload.fields([{ name: "img_p", maxCount: 1 }, { name: "img_p1", maxCount: 1 }]), async (req, res) => {
    try {
        const { libellep, prixp, descp, stockp } = req.body
        let errors = []
        let success = []
        const files = req.files

        if (!libellep || !prixp || !descp || !stockp) {
            errors = ["Completez les informations!"]
            return res.render("pages/ajout-p", { errors })
        }

        const { data, error } = await FetchROWViaNameP(libellep)

        if (data.length) {
            errors = ["Il existe un produit comme celui ci!"]
            return res.render("pages/ajout-p", { errors })
        }

        let imageUrl = null
        let imageUrl2 = null

        if (Object.values(files)[0]) {
            imageUrl = await StoreIMGBucket(Object.values(files)[0])
        }

        if (Object.values(files)[1]) {
            imageUrl2 = await StoreIMGBucket(Object.values(files)[1])
        }

        let propriety = { libellep, prixp, descp, stockp, imageUrl, imageUrl2 }

        await InsertProduct(propriety)

        success = ["Le produit est maintement ajouté, Bravo!"]
        return res.render("pages/ajout-p", { success })
    } catch (err) {
        console.error(err)
    }
})

AdminR.get("/Ad/Clients", admin, (req, res) => {
    res.render("pages/adclient")
})

AdminR.get("/Ad/Commandes", admin, (req, res) => {
    res.render("pages/adcommande")
})

AdminR.get("/Commande/Completed/:id", admin, async (req, res) => {
    const id = req.params.id

    await UpdateOrder(id, "compléte")
    res.redirect("/Ad/Commandes")
})

AdminR.get("/Commande/Cancel/:id", admin, async (req, res) => {
    const id = req.params.id

    await UpdateOrder(id, "annulé")
    res.redirect("/Ad/Commandes")
})

AdminR.get("/Produit/Edit/:id", admin, async (req, res) => {
    const id_produit = req.params.id
    let produitinfo = []

    const produit = await ShowSpecificProduct(id_produit)
    produitinfo = produit[0]
    res.render("pages/edit-p", { produitinfo })
})

AdminR.post("/Ad/Produits/Produit-edit", admin, upload.fields([{ name: "img_p", maxCount: 1 }, { name: "img_p1", maxCount: 1 }]), async (req, res) => {
    try {
        const { id, libellep, prixp, descp, stockp, imageurl, imageurl2 } = req.body
        let errors = []
        let success = []
        const files = req.files

        if (!(libellep && prixp && descp && stockp)) {
            errors = ["Completez au moins une information!"]
            return res.render("pages/edit-p", { errors })
        }

        const { data, error } = await FetchROWViaIDP(id)

        if (!data.length)
            return res.status(404).send("Page unfound!")

        let imageUrl = null
        let imageUrl2 = null

        if (Object.values(files)[0]) {
            imageUrl = await StoreIMGBucket(Object.values(files)[0])
        }

        if (Object.values(files)[1]) {
            imageUrl2 = await StoreIMGBucket(Object.values(files)[1])
        }


        imageUrl = imageUrl ? imageUrl : imageurl
        let propriety = { libellep, prixp, descp, stockp, imageUrl, imageUrl2 }

        await UpdateProduct(propriety, id)

        let produitinfo = data[0]
        success = ["Le produit est maintement modifié!"]
        return res.render("pages/edit-p", { success, produitinfo })
    } catch (err) {
        console.error(err)
    }
})

AdminR.post("/Ad/Produits/Retirer/:id", admin, async (req, res) => {
    try {
        const id = req.params.id

        const { data, error } = await FetchROWViaIDP(id)

        if (!data.length)
            return res.status(404).send("Page unfound!")

        await RemoveProduct(id)

        return res.redirect("/Ad/Produits")
    } catch (err) {
        console.error(err)
    }
})

module.exports = { AdminR }