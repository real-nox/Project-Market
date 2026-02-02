function ProduitSession() {
    const produitlist = sessionStorage.getItem("produits")
    const prod = JSON.parse(produitlist)
    if (prod)
        return prod.data
}

function CartCookie() {
    const value = `; ${document.cookie}`
    let cartCookie = value.split(`; cart=`)
    if (cartCookie.length === 2)
        cartCookie = cartCookie.pop().split(';').shift()

    return JSON.parse(decodeURIComponent(cartCookie))
}


function onCart() {
    let prod = ProduitSession()
    let cartvals = CartCookie()

    let tbody = document.querySelector("tbody")

    tbody.innerHTML = ""
    if (document.querySelector(".cartc").className.includes("closed")) {
        document.querySelector(".background").classList.add("show")
        document.querySelector(".cartc").classList.remove("closed")

        let tradd = ""
        cartvals.map(element => {
            const product = prod.find(p => p.id === element.id)
            
            tradd += `<tr>
                        <td><img src="${product.imageurl}" alt=""><span>${product.name}</span></td>
                        <td><input class="valuec" type="number" name="" id="" min="1" max="${product.stock}" value="${element.qte}" data-value="${element.qte}" data-id="${element.id}"></td>
                        <td class="prix">${element.qte * product.price}DH</td>
                        <td>
                            <span
                                class="material-symbols-outlined delete" data-id="${element.id}">close</span>
                        </td>
                </tr>`
        });

        tbody.innerHTML = tradd
    } else {
        document.querySelector(".cartc").classList.add("closed")
    }
}

window.addEventListener("load", (ev) => {
    document.querySelector(".background").addEventListener("click", (ev) => {
        document.querySelector(".background").classList.remove("show")
        document.querySelector(".cartc").classList.add("closed")
    })
    document.getElementById("confirmCart").addEventListener("click", async (e) => {
        try {
            const resultat = await fetch("/Produit/Achat-Confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            })

            if (!resultat.ok) console.log("Problème est survenue")

            window.location.href = "/Produit/Achat/Confirmation"
        } catch (err) {
            console.error(err)
        }
    })

    document.querySelector(".cartc").addEventListener("click", async (ev) => {
        if (ev.target.classList.contains("valuec")) {
            const oldval = Number(ev.target.dataset.value)
            const val = Number(ev.target.value)
            const id = Number(ev.target.dataset.id)

            const gval = val - oldval
            await updateCart(id, gval)
        }
    })

    document.querySelector(".cartc").addEventListener("click", async (ev) => {
        console.log(ev.target.classList)
        if (ev.target.classList.contains("material-symbols-outlined")) {
            const id = Number(ev.target.dataset.id)

            await removeCart(id)
        }
    })

    async function removeCart(id) {
        await fetch("/Produit/Remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ produitID: id })
        }).then((res) => res.json())
            .then(data => {
                if (data.success) {
                    document.querySelector(".background").classList.remove("show")
                    document.querySelector(".cartc").classList.add("closed")

                    onCart()
                }
            })
    }

    async function updateCart(id, val) {
        try {
            await fetch("/Produit/Update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ produitID: id, qte: val })
            }).then((res) => res.json())
                .then(data => {
                    if (data.success) {
                        document.querySelector(".background").classList.remove("show")
                        document.querySelector(".cartc").classList.add("closed")

                        onCart()
                    }
                })
        } catch (err) {
            console.error(err)
        }
    }
})