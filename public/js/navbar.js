const navLinks = document.querySelectorAll('.navbar__links__link')

//clean function
const cleanActivePage = () => {
    navLinks.forEach(nav => nav.classList.remove('active'))
}

//active page function
const activePage = (page) => {
    navLinks[page].classList.add('active')
}

//add eventlistener to each navlink
navLinks.forEach((nav, i) => {
    nav.addEventListener('click', () => {
        cleanActivePage
        activePage(i)
    })
})



// Burger menu

const navContent = document.querySelector('#navbar-content')
const navToggle = document.querySelector('#navbar-toggle')

let navActive = false

navToggle.addEventListener('click', (event) => {
    navActive = !navActive

    if (navActive) {
        navContent.classList.add('open')
    } else {
        navContent.classList.remove('open')
    }

    event.stopPropagation()
})

document.body.addEventListener('click', () => {
    if (navActive) {
        navContent.classList.remove('open')
        navActive = false
    }
})