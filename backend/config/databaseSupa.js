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
    return { data, error }
}

async function StoreIMGBucket(file) {
    console.log(new Date().toString().replace(/:/g, "-"))
    const fileName = `${new Date().toString().replace(/:/g, "-")}-${file.originalname}`

    const { error } = await supabase.storage
    .from("produits")
    .upload(fileName, file.buffer, { contentType: file.mimetype})

    if (error) throw error

    const { data } = supabase.storage
    .from("produits")
    .getPublicUrl(fileName)

    return data.publicUrl
}

async function InsertProduct(Arg) {
    await supabase.from("produit_s").insert(Arg)
}

module.exports = { supabase, FetchROWViaNameP, StoreIMGBucket, InsertProduct }