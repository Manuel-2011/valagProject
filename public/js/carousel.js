const carouselSlide = document.querySelector(".carousel__slide")
const carouselImages = document.querySelectorAll(".carousel__slide__image")

const prevBtn = document.querySelector("#prevBtn")
const nextBtn = document.querySelector("#nextBtn")

// carousel tabs
const tabs = document.querySelectorAll('.btn-icon--tabs')

//counter
let counter = 1;
let tabPrevActive = null
tabs[0].classList.add('active')
let size = carouselImages[0].clientWidth

// Function to active a tab control of the carousel
const activeTab = (prevTab, actualTab) => {
    if (prevTab < 0) {
        prevTab = tabs.length - 1
    }
    if (actualTab < 0) {
        actualTab = tabs.length - 1
    }
    tabs[prevTab].classList.remove('active')
    tabs[actualTab].classList.add('active')
}

// recalculate size when the window is resize
window.addEventListener('resize', () => {
    size = carouselImages[0].clientWidth
    carouselSlide.style.transform = "translateX(" + (-size * counter) + "px)"
})

carouselSlide.style.transform = "translateX(" + (-size * counter) + "px)"

nextBtn.addEventListener('click', ()=> {
    tabPrevActive = counter-1

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

    activeTab(tabPrevActive, counter-1)
})

prevBtn.addEventListener('click', ()=> {
    tabPrevActive = counter-1

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
    
    activeTab(tabPrevActive, counter-1)
})

// function to go to a define slide
const goToTab = (nTab) => {
    carouselSlide.style.transform = "translateX(" + (-size * nTab) + "px)"
    counter = nTab
}

// add eventlistener to each tab control
tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
        activeTab(counter-1, i)
        goToTab(i+1)
    })
})

