window.addEventListener("load", () => {
    document.getElementById("loader").classList.add("hide");
    document.getElementById("everything").classList.add("show");

    const btnarig = document.querySelector(".rig")
    const btnalef = document.querySelector(".lef")
    const imgs = document.querySelector(".imgs")

    let inp = document.getElementById("counter")

    btnarig.addEventListener("click", (e) => {
        let c = parseInt(inp.value)
        console.log(c)
        if (c === 1)
            return
        inp.value = c - 1
    })

    btnalef.addEventListener("click", (e) => {
        let c = parseInt(inp.value)
        console.log(c)
        if (c === 20)
            return
        inp.value = c + 1
    })

    document.querySelectorAll(".downbar a").forEach(link => {
        link.addEventListener("click", (ev) => {
            console.log('here2')
            ev.preventDefault()

            const index = link.dataset.index
            imgs.style.transform = `translateX(-${index * 100}%)`
        })
    })

    document.querySelector(".btnach").addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id)

        addCart(id, parseInt(inp.value))
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