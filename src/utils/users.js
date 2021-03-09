const users = []

const addUser = ({ id, username, rol}) => {
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

    // Store user
    const user = { id, username, rol }
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

const getClients = () => users.filter(user => user.rol === 'client')

const getAgents = () => users.filter(user => user.rol === 'support')


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserByName,
    getClients,
    getAgents,
}