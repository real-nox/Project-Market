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

    if (error) throw error
    return { data, error }
}

async function FetchROWViaIDP(id) {
    const { data, error } = await supabase
        .from('produit_s')
        .select()
        .eq('id', id)

    if (error) throw error
    return { data, error }
}

async function StoreIMGBucket(file) {
    const fileName = `${new Date().toString().replace(/:/g, "-")}-${file[0].originalname}`

    const { error } = await supabase.storage
        .from("produits")
        .upload(fileName, fs.createReadStream(file[0].path), { contentType: file[0].mimetype })

    if (error) throw error

    const { data } = supabase.storage
        .from("produits")
        .getPublicUrl(fileName)

    fs.unlinkSync(file[0].path)
    return data.publicUrl
}

async function InsertProduct(Arg) {
    let { libellep, prixp, descp, stockp, imageUrl, imageUrl2 } = Arg;

    const { error } = await supabase
        .from("produit_s")
        .insert([
            {
                name: libellep,
                description: descp,
                price: prixp,
                stock: stockp,
                imageurl: imageUrl,
                imageurl2: imageUrl2
            }
        ])

    if (error) {
        throw error
    }
}

async function ShowProducts() {
    const { data, error } = await supabase.from("produit_s")
        .select()
        .eq("status", 'active')

    if (error) throw error

    return data
}

async function ShowAdProducts() {
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
        console.error(err)
    }
}

async function ListeOrder() {
    try {
        const { data, error } = await supabase.from("order")
            .select()
            .order("created_at", { ascending: false })

        if (error) throw error

        return data
    } catch (err) {
        console.error(err)
    }
}

async function ShowClients() {
    const { data, error } = await supabase.from("a_client")
        .select()

    if (error) throw error

    return data
}

async function ShowSpecificClient(id) {
    const { data, error } = await supabase.from("a_client")
        .select("nom, prenom")
        .eq("id", id)

    if (error) throw error

    return data
}

async function ShowOrderViaClient(id) {
    const { data, error } = await supabase.from("order")
        .select("id_produit, qte")
        .eq("id_client", id)

    if (error) throw error

    const resultat = Object.values(data.reduce((acc, { id_produit, qte }) => {
        if (!acc[id_produit]) {
            acc[id_produit] = { id_produit, qte: 0 }
        }
        acc[id_produit].qte += qte
        return acc
    }, {}))

    return resultat
}

async function UpdateOrder(id, status) {
    try {
        const { data, error } = await supabase.from("order")
            .update({ status: status })
            .eq("id_order", id)

        if (error) throw error

        return data
    } catch (err) {
        console.error(err)
    }
}

async function UpdateProduct(Arg, id) {
    let { libellep, prixp, descp, stockp, imageUrl, imageUrl2 } = Arg;

    const { data, error } = await supabase
        .from("produit_s")
        .update(
            { name: libellep, description: descp, price: prixp, stock: stockp, imageurl: imageUrl, imageurl2: imageUrl2 })
            .eq("id", id)

    if (error) throw error
    return data
}

async function RemoveProduct(id) {

    const { data, error } = await supabase
        .from("produit_s")
        .update(
            { status: "retiré" })
            .eq("id", id)

    if (error) throw error
    return data
}

module.exports = {
    supabase,
    FetchROWViaNameP,
    FetchROWViaIDP,
    StoreIMGBucket,
    InsertProduct,
    ShowProducts,
    ShowAdProducts,
    ShowSpecificProduct,
    FindCli,
    ClientAdd,
    ListeOrder,
    Order,
    ShowClients,
    ShowOrderViaClient,
    ShowSpecificClient,
    UpdateOrder,
    UpdateProduct,
    RemoveProduct
}