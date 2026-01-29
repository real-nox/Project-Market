const { FetchROWViaNameP, StoreIMGBucket, InsertProduct } = require("../config/databaseSupa")
const path = require("path")
const express = require("express")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../frontend/public/img/images"))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const AdminR = express.Router()
const upload = multer({ storage: storage })

AdminR.get("/Produits-ajouter", (req, res) => {
    res.render("ajout-p")
})

AdminR.post("/Produits-ajouter", upload.single("img_p"), async (req, res) => {
    try {
        const { libellep, prixp, descp, stockp, img_p } = req.body
        let errors = []
        let success
        const file = req.file

        console.log("fzfzfzefz")

        /*if (!libellep || !prixp || !descp || !stockp || !img_p) {
            console.log("czedaz")
            errors = ["Completez les informations!"]
            return res.render("ajout-p", { errors, success })
        }*/

        const { data, error } = await FetchROWViaNameP(libellep)

        if (data.length) {
            console.log("hereee")
            errors = ["Il existe un produit comme celui ci!"]
            return res.render("ajout-p", { errors, success })
        }

        let imageUrl

        console.log("efzfzf")
        if (file) {
            console.log("here")
            imageUrl = await StoreIMGBucket(file)
        }

        //console.log(imageUrl)
        let propriety = { libellep, prixp, descp, stockp, imageUrl }
        await InsertProduct(propriety)

        console.log(libellep, prixp, descp, stockp, img_p)
    } catch (err) {
        console.log(err)
    }
})
module.exports = { AdminR }