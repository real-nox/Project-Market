window.addEventListener("load", () => {
    const container = document.getElementById("produitsl")
    container.innerHTML = ""

    async function ListeProduits() {
        await fetch("/api/Liste-Produits")
            .then((res) => res.json())
            .then(data => {
                document.getElementById("loader").classList.add("hide");
                document.getElementById("everything").classList.add("show");

                if (!data.length) {
                    return
                }

                for (let i = 0; i < 3 && i < data.length; i++) {
                    const element = data[i]
                    const { id, name, description, price, stock, created_at, imageurl } = element

                    const card = document.createElement("div")
                    card.className = "templateP fade-in"

                    card.innerHTML = `
                                <div class="toptemp">
                                    <h3>${name}</h3>
                                    <p>${price} DH</p>
                                </div>
                                <div class="backgroundtemp load">
                                    <img style="width:300px; height:300px" src="${imageurl}" alt="${name}" class="product-img">
                                </div>
                                <div class="downtemp">
                                    <button class="downtempbtn" href="Produit/Buy/${id}" onclick="addtoCart()">Buy now </button>
                                    <a href="/Produit/${id}">Learn more</a>
                                    <div id="responsecard" class="responsecard">
                                </div>`

                    container.appendChild(card)

                    const background = card.querySelector(".backgroundtemp")
                    const img = background.querySelector("img")

                    img.addEventListener("load", () => {
                        background.classList.remove("load")
                        img.classList.add("loaded")
                    })
                }
            })
    }

    ListeProduits()
});