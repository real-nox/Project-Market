const { FetchROWViaNameP, StoreIMGBucket, InsertProduct, UpdateOrder, ShowSpecificProduct, UpdateProduct, FetchROWViaIDP } = require("../config/databaseSupa")
const express = require("express")
const { upload } = require("../middleware/upload")
const Sessions = require("../middleware/session-cart")

const AdminR = express.Router()

AdminR.use(Sessions)

AdminR.use((req, res, next) => {

    /*if (!req.user)
        res.locals.user = req.user || []
    //return res.redirect("/Ad/Login")
    else {*/
        res.locals.user = req.user
        res.locals.errors = req.errors || []
        res.locals.success = req.success || []
        res.locals.produitinfo = req.produitinfo || []
    //}

    next()
})

AdminR.get("/Ad", (req, res) => {
    if (!req.user)
        res.redirect("/Ad/Login")
    else
        res.redirect("/Ad/Me")
})

AdminR.get("/Ad/Login", (req, res) => {
    /*if (!req.user)
        return res.redirect("/Ad/Login")*/
    res.render("admin")
})

AdminR.get("/Ad/Me", (req, res) => {
    /*if (!req.user)
        return res.redirect("/Ad/Login")
    else {*/
    const user = req.user
    res.render("", { user })
    //}

})
AdminR.get("/Ad/Produits", (req, res) => {
    res.render("pages/adproduits")
})

AdminR.get("/Ad/Produits/Produit-ajouter", (req, res) => {
    res.render("pages/ajout-p")
})

AdminR.post("/Ad/Produits/Produit-ajouter", upload.single("img_p"), async (req, res) => {
    try {
        const { libellep, prixp, descp, stockp } = req.body
        let errors = []
        let success = []
        const file = req.file

        if (!libellep || !prixp || !descp || !stockp) {
            errors = ["Completez les informations!"]
            return res.render("pages/ajout-p", { errors })
        }

        const { data, error } = await FetchROWViaNameP(libellep)

        if (data.length) {
            errors = ["Il existe un produit comme celui ci!"]
            return res.render("pages/ajout-p", { errors })
        }

        let imageUrl

        if (file) {
            imageUrl = await StoreIMGBucket(file)
        }

        let propriety = { libellep, prixp, descp, stockp, imageUrl }

        await InsertProduct(propriety)

        success = ["Le produit est maintement ajouté, Bravo!"]
        return res.render("pages/ajout-p", { success })
    } catch (err) {
        console.error(err)
    }
})

AdminR.get("/Ad/Clients", (req, res) => {
    res.render("pages/adclient")
})

AdminR.get("/Ad/Commandes", (req, res) => {
    res.render("pages/adcommande")
})

AdminR.get("/Commande/Completed/:id", async (req, res) => {
    const id = req.params.id

    await UpdateOrder(id, "compléte")
    res.redirect("/Ad/Commandes")
})

AdminR.get("/Commande/Cancel/:id", async (req, res) => {
    const id = req.params.id

    await UpdateOrder(id, "annulé")
    res.redirect("/Ad/Commandes")
})

AdminR.get("/Produit/Edit/:id", async (req, res) => {
    const id_produit = req.params.id
    let produitinfo = []

    const produit = await ShowSpecificProduct(id_produit)
    produitinfo = produit[0]
    res.render("pages/edit-p", { produitinfo })
})

AdminR.post("/Ad/Produits/Produit-edit", upload.single("img_p"), async (req, res) => {
        try {
        const { id, libellep, prixp, descp, stockp, imageurl } = req.body
        let errors = []
        let success = []
        const file = req.file

        if (!(libellep && prixp &&  descp && stockp)) {
            errors = ["Completez au moins une information!"]
            return res.render("pages/edit-p", { errors })
        }

        const { data, error } = await FetchROWViaIDP(id)

        if (!data.length)
            return res.status(404).send("Page unfound!")

        let imageUrl

        if (file)
            imageUrl = await StoreIMGBucket(file)

        imageUrl = imageUrl ? imageUrl : imageurl
        let propriety = { libellep, prixp, descp, stockp, imageUrl }

        await UpdateProduct(propriety, id)

        let produitinfo = data[0]
        success = ["Le produit est maintement modifié!"]
        return res.render("pages/edit-p", { success, produitinfo })
    } catch (err) {
        console.error(err)
    }
})

module.exports = { AdminR }