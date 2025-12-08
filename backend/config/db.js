// backend/config/db.js

const knex = require('knex');

// 1. Configuración para usar SQLite (guarda la base de datos en un archivo 'miweb.sqlite')
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: "./miweb.sqlite" // Este es el archivo de tu base de datos
    },
    useNullAsDefault: true,
});

// 2. Función para crear la tabla de usuarios si no existe
const createUsersTable = async () => {
    const exists = await db.schema.hasTable('users');
    if (!exists) {
        await db.schema.createTable('users', table => {
            table.increments('id').primary();
            table.string('email').unique().notNullable();
            table.string('password').notNullable(); // Contraseña cifrada
            table.string('name').notNullable();
            table.enum('role', ['admin', 'usuario']).defaultTo('usuario').notNullable();
            table.timestamps(true, true); // created_at y updated_at
        });
        console.log("✅ Tabla 'users' creada.");
    } else {
        console.log("✅ Conexión SQLite establecida.");
    }
};

// La creamos la tabla al iniciar la DB
createUsersTable();

module.exports = db;