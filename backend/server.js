const express = require('express');
const cors = require('cors');
const path = require('path');

// --- Importación de Rutas ---
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courseRoutes'); 
const userManagementRoutes = require('./routes/userManagementRoutes'); // GESTIÓN DE CURSOS POR USUARIO

const app = express();

// --- Middleware ---

// La URL de tu dominio de Netlify (Esto soluciona el error CORS)
const allowedOrigin = 'https://sistemanota.netlify.app';

// Configuración de CORS para permitir solo tu dominio de frontend
const corsOptions = {
    origin: allowedOrigin,
    optionsSuccessStatus: 200 
};

// Permite solicitudes CORS (usando la configuración específica)
app.use(cors(corsOptions)); 

// Permite al servidor leer JSON
app.use(express.json()); 

// --- Configuración de Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes); 
app.use('/api/users', userManagementRoutes); // RUTA DE GESTIÓN DE USUARIOS

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API está funcionando...');
});

// Puerto del Servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));