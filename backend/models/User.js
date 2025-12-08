// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importamos bcrypt para cifrar la contraseña

const userSchema = new mongoose.Schema({
    // Campo obligatorio para el login
    email: {
        type: String,
        required: true,
        unique: true, // No puede haber dos usuarios con el mismo email
        trim: true,
        lowercase: true
    },
    // Contraseña cifrada (NUNCA texto plano)
    password: {
        type: String,
        required: true
    },
    // Campo crucial para tu lógica: define los permisos
    role: {
        type: String,
        enum: ['admin', 'usuario'], // Solo permite estos dos valores
        default: 'usuario' // Por defecto, es un usuario normal
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Añade campos createdAt y updatedAt automáticamente
});

// Middleware de Mongoose: Se ejecuta ANTES de que el documento se guarde (save)
userSchema.pre('save', async function(next) {
    // Solo si la contraseña ha sido modificada (o es nueva)
    if (!this.isModified('password')) {
        return next();
    }
    
    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para verificar la contraseña al hacer login
userSchema.methods.matchPassword = async function(enteredPassword) {
    // Compara la contraseña ingresada con la contraseña cifrada en la DB
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;