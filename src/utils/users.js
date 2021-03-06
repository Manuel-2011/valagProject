const users = []

const addUser = ({ id, username, rol, supportType }) => {
    // Clean the data
    username = username.trim().toLowerCase()

    // Validate tha data
    if (!username) {
        return {
            error: 'El nombre de usuario es requerido'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'UsernameInvalid'
        }
    }

    // Check supportType is assigned
    if (supportType !== 'tecnico' && supportType !== 'administrativo') {
        return {
            error: 'supportType empty'
        }
    }

    // Store user
    const user = { id, username, rol, supportType }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserByName = (name) => {
    return users.find((user) => user.username === name)
}

const getClients = (type) => users.filter(user => user.rol === 'client' && user.supportType === type)

const getAgents = (type) => users.filter(user => user.rol !== 'client' && user.supportType === type)


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserByName,
    getClients,
    getAgents,
}