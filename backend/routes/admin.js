const { FetchROWViaNameP, StoreIMGBucket, InsertProduct } = require("../config/databaseSupa")
const express = require("express")
const { upload } = require("../middleware/upload")

const AdminR = express.Router()

AdminR.use((req, res, next) => {
    res.locals.errors = []
    res.locals.success = []
    next()
})

AdminR.get("/Produits-ajouter", (req, res) => {
    res.render("ajout-p")
})

AdminR.post("/Produits-ajouter", upload.single("img_p"), async (req, res) => {
    try {
        const { libellep, prixp, descp, stockp } = req.body
        let errors = []
        let success
        const file = req.file

        if (!libellep || !prixp || !descp || !stockp) {
            errors = ["Completez les informations!"]
            return res.render("ajout-p", { errors, success })
        }

        const { data, error } = await FetchROWViaNameP(libellep)

        if (data.length) {
            errors = ["Il existe un produit comme celui ci!"]
            return res.render("ajout-p", { errors, success })
        }

        let imageUrl

        if (file) {
            imageUrl = await StoreIMGBucket(file)
        }

        let propriety = { libellep, prixp, descp, stockp, imageUrl }

        const resultat = await InsertProduct(propriety)

        if (resultat) {
            return res.render("ajout-p", { success: "Le produit est maintement ajouté, Bravo!" })
        }
    } catch (err) {
        console.log(err)
    }
})
module.exports = { AdminR }