require("dotenv").config({ quiet: true })
const { createClient } = require("@supabase/supabase-js")

const fs = require("fs")

const url = process.env.DATABASE_URL
const key = process.env.DATABASE_KEY

const supabase = createClient(url, key)

async function FetchROWViaNameP(nomp) {
    const { data, error } = await supabase
        .from('produit_s')
        .select()
        .eq('name', nomp)
    console.log(data)
    return { data, error }
}

async function StoreIMGBucket(file) {
    const fileName = `${new Date().toString().replace(/:/g, "-")}-${file.originalname}`

    const { error } = await supabase.storage
        .from("produits")
        .upload(fileName, fs.createReadStream(file.path), { contentType: file.mimetype })

    if (error) throw error

    const { data } = supabase.storage
        .from("produits")
        .getPublicUrl(fileName)

    fs.unlinkSync(file.path)
    return data.publicUrl
}

async function InsertProduct(Arg) {
    let { libellep, prixp, descp, stockp, imageUrl } = Arg;

    const { error } = await supabase
        .from("produit_s")
        .insert([
            {
                name: libellep,
                description: descp,
                price: prixp,
                stock: stockp,
                imageurl: imageUrl
            }
        ])

    if (error) {
        throw error
    }
}

async function ShowProducts() {
    const { data, error } = await supabase.from("produit_s")
        .select()

    if (error) throw error

    return data
}

async function ShowSpecificProduct(id, predicat = "*") {
    const { data, error } = await supabase.from("produit_s")
        .select(predicat)
        .eq("id", id)

    if (error) throw error

    return data
}

async function FindCli(nom, prenom) {
    const { data, error } = await supabase.from("a_client")
        .select()
        .eq("nom", nom)
        .eq("prenom", prenom)

    if (error) throw error

    return data
}

async function ClientAdd(client) {
    const { nom, prenom, numt, ville, adresse } = client
    const { data, error } = await supabase.from("a_client")
        .insert({ nom: nom, prenom: prenom, numtel: numt, adresse: adresse, ville: ville })
        .select()

    if (error) throw error

    return data
}

async function Order(id, id_client, qte) {
    try {
        const { data, error } = await supabase.from("order")
            .insert({ id_client: id_client, id_produit: id, qte: qte })
            .select()

        if (error) throw error

        return data
    } catch (err) {
        console.log(err)
    }
}

async function ShowClients() {
    const { data, error } = await supabase.from("a_client")
        .select()

    if (error) throw error

    return data
}

async function ShowOrderViaClient(id) {
    const { data, error } = await supabase.from("order")
        .select("id_produit, qte")
        .eq("id_client", id)

    if (error) throw error

    const resultat = Object.values(data.reduce((acc, {id_produit, qte}) => {
        if (!acc[id_produit]) {
            acc[id_produit] = { id_produit, qte: 0}
        }
        acc[id_produit].qte += qte
        return acc
    }, {}))

    return resultat
}

module.exports = { supabase, FetchROWViaNameP, StoreIMGBucket, InsertProduct, ShowProducts, ShowSpecificProduct, FindCli, ClientAdd, Order, ShowClients, ShowOrderViaClient }