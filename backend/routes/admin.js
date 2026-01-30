const { FetchROWViaNameP, StoreIMGBucket, InsertProduct } = require("../config/databaseSupa")
const express = require("express")
const { upload } = require("../middleware/upload")
const Sessions = require("../middleware/session")

const AdminR = express.Router()

AdminR.use(Sessions)

AdminR.use((req, res, next) => {

    if (!req.user)
        res.locals.user = req.user || []
    //return res.redirect("/Ad/Login")
    else
        res.locals.user = req.user
    res.locals.errors = req.errors || []
    res.locals.success = req.success || []
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
AdminR.get("/Produits-ajouter", (req, res) => {
    res.render("pages/ajout-p")
})

AdminR.post("/Produits-ajouter", upload.single("img_p"), async (req, res) => {
    try {
        const { libellep, prixp, descp, stockp } = req.body
        let errors = []
        let success = []
        const file = req.file

        if (!libellep || !prixp || !descp || !stockp) {
            errors = ["Completez les informations!"]
            return res.render("ajout-p", { errors })
        }

        const { data, error } = await FetchROWViaNameP(libellep)

        if (data.length) {
            errors = ["Il existe un produit comme celui ci!"]
            return res.render("ajout-p", { errors })
        }

        let imageUrl

        if (file) {
            imageUrl = await StoreIMGBucket(file)
        }

        let propriety = { libellep, prixp, descp, stockp, imageUrl }

        await InsertProduct(propriety)

        success = ["Le produit est maintement ajouté, Bravo!"]
        return res.render("ajout-p", { success })
    } catch (err) {
        console.log(err)
    }
})
module.exports = { AdminR }