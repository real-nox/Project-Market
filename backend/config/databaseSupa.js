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

module.exports = { supabase, FetchROWViaNameP, StoreIMGBucket, InsertProduct }