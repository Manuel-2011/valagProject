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