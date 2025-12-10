const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// 💡 CORRECCIÓN CRÍTICA: Leer la clave secreta de las variables de entorno (Render)
const JWT_SECRET = process.env.JWT_SECRET || '0ca1ab53a90503cfa6b021197cdd6681';

// RUTA CORREGIDA: Desde /middleware/authMiddleware.js, 
// un '..' lleva a /backend, y de ahí bajamos a /data/users.json
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

const readUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // En caso de error (archivo no encontrado o mal formato), devuelve array vacío
        return []; 
    }
};

// Middleware para verificar el token JWT y autenticar al usuario
const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // AHORA USA JWT_SECRET
            const decoded = jwt.verify(token, JWT_SECRET); 
            
            const users = readUsers();
            req.user = users.find(u => u.id === decoded.id);

            if (!req.user) {
                 return res.status(401).json({ message: 'Token inválido o usuario no encontrado.' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'No autorizado, token fallido.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no hay token.' });
    }
};

// Middleware para verificar si el usuario es administrador
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Acceso denegado. Solo para administradores.' });
    }
};

module.exports = { protect, admin };