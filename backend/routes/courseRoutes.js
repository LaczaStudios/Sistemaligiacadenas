const express = require('express');
const fs = require('fs');
const path = require('path');
// Ruta relativa desde /routes a /middleware
const { protect, admin } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Ruta relativa desde /routes a /data
const COURSES_FILE = path.join(__dirname, '..', 'data', 'courses.json');

// Función auxiliar para leer los cursos
const readCourses = () => {
    try {
        const data = fs.readFileSync(COURSES_FILE, 'utf8');
        // Devuelve un objeto vacío si falla la lectura (para evitar errores 500)
        return JSON.parse(data); 
    } catch (error) {
        return {}; 
    }
};

// Función auxiliar para escribir los cursos
const writeCourses = (courses) => {
    try {
        // Formatear JSON con 4 espacios para fácil lectura
        fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 4), 'utf8');
        return true;
    } catch (error) {
        return false;
    }
};

// @route   GET /api/courses
// @desc    Obtener todos los datos de cursos
// @access  Protegido
router.get('/', protect, (req, res) => {
    const courses = readCourses();
    res.json(courses);
});

// @route   POST /api/courses
// @desc    Actualizar datos de cursos y enlaces
// @access  Admin (Solo administradores)
router.post('/', protect, admin, (req, res) => {
    const newCoursesData = req.body;

    if (writeCourses(newCoursesData)) {
        res.json({ message: 'Cursos y enlaces actualizados con éxito.', courses: newCoursesData });
    } else {
        res.status(500).json({ message: 'Error al guardar los datos de los cursos.' });
    }
});

module.exports = router;