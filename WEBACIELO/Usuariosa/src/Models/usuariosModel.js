const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'usuariosa'
});

// Obtener todos los usuarios
async function obtenerUsuarios() {
    const [rows] = await db.query(
        'SELECT id, nombre, email, usuario, telefono, rol FROM usuarios'
    );
    return rows;
}

// Obtener un usuario por ID
async function obtenerUsuario(id) {
    const [rows] = await db.query(
        'SELECT id, nombre, email, usuario, telefono, rol FROM usuarios WHERE id = ?',
        [id]
    );
    return rows;
}

// Obtener usuario para login
async function obtenerUsuarioLogin(usuario) {
    const [rows] = await db.query(
        'SELECT * FROM usuarios WHERE usuario = ?',
        [usuario]
    );
    return rows[0];
}

// Crear usuario
async function crearUsuario(nombre, email, usuario, password, telefono, rol) {
    const [result] = await db.query(
        `INSERT INTO usuarios
        (nombre, email, usuario, password, telefono, rol)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, email, usuario, password, telefono, rol]
    );

    return {
        id: result.insertId,
        nombre,
        email,
        usuario,
        telefono,
        rol
    };
}

// Actualizar usuario
async function actualizarUsuario(
    id,
    nombre,
    email,
    usuario,
    telefono,
    rol
) {
    const [result] = await db.query(
        `UPDATE usuarios
        SET nombre = ?,
            email = ?,
            usuario = ?,
            telefono = ?,
            rol = ?
        WHERE id = ?`,
        [nombre, email, usuario, telefono, rol, id]
    );

    return result.affectedRows;
}

// Actualizar contraseña
async function actualizarPassword(id, password) {
    const [result] = await db.query(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [password, id]
    );

    return result.affectedRows;
}

// Eliminar usuario
async function eliminarUsuario(id) {
    const [result] = await db.query(
        'DELETE FROM usuarios WHERE id = ?',
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    obtenerUsuarioLogin,
    crearUsuario,
    actualizarUsuario,
    actualizarPassword,
    eliminarUsuario
};