window.addEventListener("load", (ev) => {
    new Device().main()
})

window.addEventListener("change", (ev) => {
    new Device().main()
})

function mobilelist() {
    document.querySelector(".mobilec").classList.toggle("show")
}

class Device {
    constructor() {
        this.content = null
    }

    main() {
        if (window.innerWidth <= 500) {
            this.smalldevice()
        }
    }

    smalldevice() {
        const header = document.querySelector("header")
        header.innerHTML += '<div class="mobilec"></div > '

        const navigationbar = document.querySelector(".navigation")

        this.content = document.querySelector("#part2-nav").innerHTML

        navigationbar.removeChild(document.getElementById("part2-nav"))

        navigationbar.innerHTML += `<div class="phonelist">
                <button style="width: 0; heigth:0; border: 0; background-color: transparent;" class="mobilelist" onclick="mobilelist()"><span class="material-symbols-outlined list">menu</span></button>
            </div>`

        this.mobile_div()
    }
    
    mobile_div() {
        document.querySelector(".mobilec").innerHTML = this.content
    }
}