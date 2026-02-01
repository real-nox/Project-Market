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

        await fetch("/api/Liste-Commandes").then((res) => res.json())
            .then(data => {
                stopLoading()

                let trinfo = ""
                data.forEach(global_data => {

                    let Data = global_data.data
                    const formatedDate = new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                    }).format(new Date(Data.created_at))

                    const nomc = Data.nom.toUpperCase() + " " + Data.prenom.charAt(0).toUpperCase() + Data.prenom.slice(1)

                    console.log(Data)
                    let statusStyle = ""
                    if (Data.status === "en cours") {
                        statusStyle = "yellow"
                        trinfo += `<tr>
                                    <td>${formatedDate}</td>
                                    <td class="nomproduit"><span>${nomc}</span></td>
                                    <td>${Data.prixt}</td>
                                    <td class="status yellow"><p>${Data.status}</p></td>
                                    <td><li>${Data.nomp} - ${Data.qte}</li></td>
                                    <td>
                                    <a href="/Commande/Cancel/${Data.id}"><span class="material-symbols-outlined danger">close</span></a>
                                    <a href="/Commande/Completed/${Data.id}"><span class="material-symbols-outlined success">check</span></a>
                                    </td>
                                </tr>`
                    } else if (Data.status === "annulé") {
                        trinfo += `<tr>
                                    <td>${formatedDate}</td>
                                    <td class="nomproduit"><span>${nomc}</span></td>
                                    <td>${Data.prixt}</td>
                                    <td class="status red"><p>${Data.status}</p></td>
                                    <td><li>${Data.nomp} - ${Data.qte}</li></td>
                                    <td></td>
                                </tr>`
                    } else if (Data.status === "compléte") {
                        trinfo += `<tr>
                                    <td>${formatedDate}</td>
                                    <td class="nomproduit"><span>${nomc}</span></td>
                                    <td>${Data.prixt}</td>
                                    <td class="status green"><p>${Data.status}</p></td>
                                    <td><li>${Data.nomp} - ${Data.qte}</li></td>
                                    <td></td>
                                </tr> `
                    }
                })

                document.querySelector("tbody").innerHTML = trinfo
            })
    }

    await LoadProduits()
});