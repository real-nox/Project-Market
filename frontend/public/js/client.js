window.addEventListener("load", async () => {

    document.getElementById("loader").classList.add("hide");
    document.getElementById("everything").classList.add("show");

    let loadingc
    let container = document.getElementById("loadingcontent")
    let text = document.getElementById("loadingcontenth1")

    function Loading() {
        let dots = 0

        loadingc = setInterval(() => {
            dots = (dots + 1) % 4
            text.textContent = "Loading" + ".".repeat(dots)
        }, 500);
    }

    function stopLoading() {
        clearInterval(loadingc);
        text.style.display = "none"
        container.style.display = "none"
    }

    async function LoadProduits() {
        Loading()
        const reslutat = await fetch("/api/Liste-Clients").then((res) => res.json())
            .then(data => {
                stopLoading()

                let trinfo = ""
                data.forEach(global_data => {

                    let Data = global_data.data
                    let commandes = global_data.commandes
                    const formatedDate = new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                    }).format(new Date(Data.created_at))

                    const nomc = Data.nom.toUpperCase() + " " + Data.prenom.charAt(0).toUpperCase() + Data.prenom.slice(1)

                    const cmds = commandes.map(c => `<li>${c.name} - ${c.qte}</li>`).join("")
                    trinfo += `<tr>
                                            <td class="nomproduit"><span>${nomc}</span></td>
                                            <td>0${Data.numtel}</td>
                                            <td>${Data.ville}</td>
                                            <td>${Data.adresse}</td>
                                            <td>${formatedDate}</td>
                                            <td><ul>${cmds}</ul></td>
                                            </tr>`

                })

                document.querySelector("tbody").innerHTML = trinfo
            })
    }

    await LoadProduits()
});