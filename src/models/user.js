const mongoose =  require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: [6, 'La contraseña debe contener al menos 6 caracteres!'],
    },
    correo: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Correo invalido!')
            }
        }
    },
    rol: {
        type: String,
        required: true
    },
    supportType: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// get public user info replacing the toJSON method ensuring that is always called
userSchema.methods.toJSON = function () {
    const user = this
    const userOject = user.toObject()
    delete userOject.password
    delete userOject.tokens
    
    return userOject
}

// agregar metodo para generar token a la instancia del user
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// crear metodo en el modelo para buscar usuario por credenciales
userSchema.statics.findByCredentials = async (correo, password) => {
    const user = await User.findOne({correo})

    if (!user) {
        throw new Error('No se pudo hacer login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('No se pudo hacer login!')
    }

    return user
}

// Hash la contraseña antes de guardar usuario en la base de datos
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User