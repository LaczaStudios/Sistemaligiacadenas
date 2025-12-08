const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
// Ruta relativa desde /routes a /middleware
const { protect, admin } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Ruta relativa desde /routes a /data
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

const readUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4), 'utf8');
        return true;
    } catch (error) {
        return false;
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, 'tu_clave_secreta_aqui', {
        expiresIn: '7d',
    });
};

// @route   POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    // NOTA: En un entorno real, la contraseña debe ser hasheada y comparada.
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, 
            // IMPORTANTE: NO enviamos los cursos en el login, solo en el perfil para seguridad.
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});

// @route   POST /api/auth/register 
// Protegida por el middleware 'protect'
router.post('/register', protect, admin, (req, res) => {
    const { name, email, password, role = 'usuario', courses = [] } = req.body;
    const users = readUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    // Asignar un ID único simple para este ejemplo
    const newId = Date.now(); 

    const newUser = {
        id: newId,
        name,
        email,
        password,
        role,
        courses: courses // Incluir el campo courses en el registro
    };

    users.push(newUser);

    if (writeUsers(users)) {
        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } else {
        res.status(500).json({ message: 'Error al guardar el usuario' });
    }
});

// @route   GET /api/auth/profile
// ESTA ES LA RUTA CORREGIDA PARA INCLUIR EL CAMPO 'courses'
router.get('/profile', protect, (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        courses: req.user.courses // <-- ESTO ES LO QUE FALTABA
    });
});

module.exports = router;