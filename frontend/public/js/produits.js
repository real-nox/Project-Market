window.addEventListener("load", async () => {
    const container = document.getElementById("produitsl")
    container.innerHTML = ""

    document.getElementById("loader").classList.add("hide");
    document.getElementById("everything").classList.add("show");

    async function ListePorduits(data) {
        try {
            data.forEach(element => {
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
                                <div class="downtemp" >
                                    <button class="downtempbtn" data-id="${id}">Buy now </button>
                                    <a href="/Produit/${id}">Learn more</a>
                                </div>
                                `

                container.appendChild(card)

                const background = document.querySelector(".backgroundtemp")
                const img = background.querySelector("img")

                img.addEventListener("load", (e) => {
                    background.classList.remove("load")
                    img.classList.add("loaded")
                })
            })
        } catch (err) {
            console.error(err);

        }
    }

    const cached = sessionStorage.getItem("produits")
    const expirationt = 1000 * 60

    if (cached) {
        const { data, exp } = JSON.parse(cached)

        if (exp > Date.now()) {
            await ListePorduits(data)
        } else {
            sessionStorage.removeItem("produits")
        }
    } else {
        const resultat = await fetch("/api/Liste-Produits")
        const data = await resultat.json()

        if (!data.length) {
            const h1 = document.createElement("h1")
            h1.innerHTML = "Il se peut qu'il n'y ait rien"
            container.classList.add("not")
            container.appendChild(h1)
        }

        await ListePorduits(data)

        sessionStorage.setItem("produits", JSON.stringify({
            data,
            exp: Date.now() + expirationt
        }))
    }

    document.querySelectorAll(".downtempbtn").forEach(button => {
        button.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id)

            addCart(id, 1)
        })
    })

    function addCart(id, qtn) {
        fetch("/Produit/acheter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ produitID: id, qte: qtn })
        }).then((res) => res.json())
            .then(data => {
                if (data.success) {
                    showup(data.message)
                } else {
                    errorshow(data.message)
                }
            })
    }

    function errorshow(message) {
        document.querySelector(".responsecard").innerHTML = `
            <h4>Error!</h4>
            <ul>
                <li>
                    ${message}
                </li>
            </ul>
            `

        document.getElementById("responsecard").classList.add("open")

        setTimeout(() => {
            document.getElementById("responsecard").classList.remove("open")
        }, 5000);
    }

    function showup(message) {
        document.querySelector(".responsecard").innerHTML = `
            <h4>Success!</h4>
            <ul>
                <li>
                    ${message}
                </li>
            </ul>
            `

        document.getElementById("responsecard").classList.add("open")

        setTimeout(() => {
            document.getElementById("responsecard").classList.remove("open")
        }, 5000);
    }
});