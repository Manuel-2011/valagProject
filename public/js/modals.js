// Añadir evento para que se cierre el modal cuando se de click
// en el background del modal

const $modals = document.querySelectorAll('.modal')

$modals.forEach(element => {
    element.addEventListener('click', (e) => {
        // Detener evento cuando el click se haga dentro del contenido del modal
        const $modalContent = element.querySelector('.modal__content')
        if ($modalContent.contains(e.target)) {
            return
        }

        // nombre de la tarjeta del servicio
        const serviceId = element.id.replace('modal-', '')
        // Seleccionar tarjeta con servicio para ocultar modal
        window.location.href = `/#${serviceId}`;
    })
})