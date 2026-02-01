const express = require("express")
const api = express.Router()

const { ShowProducts, ShowAdProducts, ShowClients, ShowOrderViaClient, ShowSpecificProduct, ListeOrder, ShowSpecificClient } = require("../config/databaseSupa")

api.get("/api/Liste-Produits", async (req, res) => {
    try {
        const data = await ShowProducts()

        res.json(data)
    } catch (err) {
        console.error(err);
    }
})

api.get("/api/ad/Liste-Produits", async (req, res) => {
    try {
        const data = await ShowAdProducts()

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

api.get("/api/Liste-Commandes", async (req, res) => {
    try {
        const data = await ListeOrder()
        const list = []

        for (const commande of data) {
            const client = await ShowSpecificClient(commande.id_client)

            if(!client[0]) continue
            const produit = await ShowSpecificProduct(commande.id_produit, "name, price")

            if(!produit[0]) continue

            list.push({
                data: {
                    id: commande.id_order,
                    created_at: commande.created_at,
                    status: commande.status,
                    nomp: produit[0].name,
                    nom: client[0].nom,
                    prenom: client[0].prenom,
                    prixt: produit[0].price * commande.qte,
                    qte: commande.qte
                }
            })
        }

        res.json(list)
    } catch (err) {
        console.error(err);
    }
})

module.exports = { api }