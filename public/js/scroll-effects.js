// banner first slide button
const btnBanner1 = document.querySelector("#btn-banner-slide-1")
// banner second slide button
const btnBanner2 = document.querySelector("#btn-banner-slide-2")


// Add scroll effect

btnBanner1.addEventListener('click', () => {
    document.querySelector('#servicios').scrollIntoView({
        behavior: "smooth"
    })
})

btnBanner2.addEventListener('click', () => {
    document.querySelector('#servicios').scrollIntoView({
        behavior: "smooth"
    })
})