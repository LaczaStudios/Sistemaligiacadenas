// backend/data/users.js (Simulación de DB con Archivo JSON)

const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFilePath = path.join(__dirname, 'users.json');

// Función para leer todos los usuarios del archivo
const readUsers = async () => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o está vacío, devuelve un array vacío
        if (error.code === 'ENOENT') { 
            return [];
        }
        throw error;
    }
};

// Función para escribir todos los usuarios en el archivo
const writeUsers = async (users) => {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

// Función para encontrar un usuario por email (usada en Login)
const findUserByEmail = async (email) => {
    const users = await readUsers();
    return users.find(user => user.email === email);
};

// Función para encontrar un usuario por ID (usada en el Middleware)
const findUserById = async (id) => {
    const users = await readUsers();
    return users.find(user => user.id === id);
};

// Función para crear un nuevo usuario (usada en Registro)
const createUser = async (userData) => {
    const users = await readUsers();
    
    const newUser = {
        id: Date.now(), // ID simple basado en el tiempo
        name: userData.name,
        email: userData.email,
        password: userData.password, // Ya cifrada
        role: userData.role || 'usuario',
        createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    await writeUsers(users);
    
    return newUser;
};

// Esta función simula el MatchPassword que teníamos en el modelo.
const matchPassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    readUsers,
    matchPassword
};