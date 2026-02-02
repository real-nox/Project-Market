window.addEventListener("load", () => {
    document.getElementById("loader").classList.add("hide");
    document.getElementById("everything").classList.add("show");

    function ProduitSession() {
        const produitlist = sessionStorage.getItem("produits")
        const prod = JSON.parse(produitlist)
        if (prod)
            return prod.data
        else
            document.location.href = "/Produits"
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

        let tbody = document.querySelector(".tbody")

        tbody.innerHTML = ""

        let tradd = ""
        cartvals.map(element => {
            const product = prod.find(p => p.id === element.id)
            tradd += `<tr>
                        <td><img src="${product.imageurl}" alt=""><span>${product.name}</span></td>
                        <td><input class="valuec" type="number" name="" id="" min="1" max="${product.stock}" value="${element.qte}" data-value="${element.qte}" data-id="${element.id}" readonly></td>
                        <td class="prix">${element.qte * product.price}DH</td>
                        </tr>`
        });

        tbody.innerHTML = tradd
    }

    onCart()
});