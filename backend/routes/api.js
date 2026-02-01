const express = require("express")
const api = express.Router()

const { ShowProducts, ShowClients, ShowOrderViaClient, ShowSpecificProduct } = require("../config/databaseSupa")

api.get("/api/Liste-Produits", async (req, res) => {
    try {
        const data = await ShowProducts()

        res.json(data)
    } catch (err) {
        console.error(err);
    }
})

api.get("/api/Liste-Clients", async (req, res) => {
    try {
        const globaldata = []
        const data = await ShowClients()

        for (const element of data) {
            const newdata = await ShowOrderViaClient(element.id)

            const commandes = []
            for (const order of newdata) {

                const { id_produit, qte } = order
                const produitNom = await ShowSpecificProduct(id_produit, "name")

                commandes.push({
                    name: produitNom[0].name,
                    qte: qte
                })
            }

            globaldata.push({
                data: element,
                commandes
            })
        }

        res.json(globaldata)
    } catch (err) {
        console.error(err);
    }
})


module.exports = { api }