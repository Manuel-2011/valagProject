const carouselSlide = document.querySelector(".carousel__slide")
const carouselImages = document.querySelectorAll(".carousel__slide__image")

const prevBtn = document.querySelector("#prevBtn")
const nextBtn = document.querySelector("#nextBtn")

//counter
let counter = 1;
const size = carouselImages[0].clientWidth

carouselSlide.style.transform = "translateX(" + (-size * counter) + "px)"

nextBtn.addEventListener('click', ()=> {
    counter ++
    if (counter >= carouselImages.length) {
        counter = 0
        carouselSlide.style.transition = "none"
        carouselSlide.style.transform = "translateX(" + (-size * counter) + "px)"
        counter ++
        setTimeout(() => {
            carouselSlide.style.transition = "transform 0.4s ease-in-out"
            carouselSlide.style.transform = "translateX(" + (-size * counter) + "px)"
        }, 100)
    } else {
        carouselSlide.style.transition = "transform 0.4s ease-in-out"
        carouselSlide.style.transform = "translateX(" + (-size * counter) + "px)"
    }
})

prevBtn.addEventListener('click', ()=> {
    counter --
    if (counter < 0) {
        counter = carouselImages.length - 1
        carouselSlide.style.transition = "none"
        carouselSlide.style.transform = "translateX(" + (-size * counter) + "px)"
        counter --
        setTimeout(() => {
            carouselSlide.style.transition = "transform 0.4s ease-in-out"
            carouselSlide.style.transform = "translateX(" + (-size * counter) + "px)"
        }, 100)
    } else {
        carouselSlide.style.transition = "transform 0.4s ease-in-out"
        carouselSlide.style.transform = "translateX(" + (-size * counter) + "px)"
    }
})