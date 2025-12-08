const express = require('express');
const fs = require('fs');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

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

// @route   GET /api/users
// @desc    Obtener lista de usuarios (solo admin)
// @access  Admin
router.get('/', protect, admin, (req, res) => {
    const users = readUsers().map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        courses: user.courses || [] // Aseguramos que 'courses' exista
    }));
    res.json(users);
});

// @route   PUT /api/users/:id/courses
// @desc    Actualizar cursos asignados a un usuario (solo admin)
// @access  Admin
router.put('/:id/courses', protect, admin, (req, res) => {
    const userId = parseInt(req.params.id);
    const { courses } = req.body; // Array de claves de sección (e.g., ["1a", "2c"])
    let users = readUsers();

    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (!Array.isArray(courses)) {
        return res.status(400).json({ message: 'Formato de cursos inválido.' });
    }

    // Actualizar solo el campo 'courses'
    users[index].courses = courses;

    if (writeUsers(users)) {
        res.json({ message: 'Cursos asignados actualizados con éxito.', user: users[index] });
    } else {
        res.status(500).json({ message: 'Error al guardar los datos.' });
    }
});

module.exports = router;