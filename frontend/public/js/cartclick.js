function ProduitSession() {
    const produitlist = sessionStorage.getItem("produits")
    const prod = JSON.parse(produitlist).data
    return prod
}

function CartCookie() {
    const value = `; ${document.cookie}`
    let cartCookie = value.split(`; cart=`)
    if (cartCookie.length === 2)
        cartCookie = cartCookie.pop().split(';').shift()

    return JSON.parse(decodeURIComponent(cartCookie))
}


function onCart() {
    const prod = ProduitSession()
    const cartvals = CartCookie()

    const cartdiv = document.querySelector(".cartc")

    let centercart = document.querySelector(".centercart")
    centercart.innerHTML = ""
    if (cartdiv.className.includes("closed")) {

        document.querySelector(".cartc").classList.remove("closed")

        let divadd = ""
        cartvals.map(element => {
            const product = prod.find(p => p.id === element.id)
            divadd += `<div class="template ">
                            <div class="part1h4">
                                <img src="${product.imageurl}" alt="">
                                <p>${product.name}</p>
                            </div>
                            <div class="part2h4">
                                <input type="text" name="" id="" value="${element.qte}" readonly>
                                <p>${element.qte * product.price}DH</p>
                                <button type="reset">x</button>
                            </div>
                        </div>`
        });

        centercart.innerHTML = divadd
    } else {
        document.querySelector(".cartc").classList.add("closed")
    }
}

document.getElementById("confirmCart").addEventListener("click", async (e) => {
    try {
        console.log("hereeee")
        const resultat = await fetch("/Produit/Achat-Confirmation", {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        })

        console.log(resultat)
        if (!resultat.ok) console.log("Problème est survenue")

        //window.location.href = "/Produit/Achat-Confirmation"
    } catch (err) {
        console.log(err)
    }
})