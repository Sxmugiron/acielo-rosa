const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'capascitas'
});

// Obtener todas las citas
async function obtenerCitas() {
    const [rows] = await connection.query(
        'SELECT * FROM citas'
    );

    return rows;
}

// Obtener una cita por ID
async function obtenerCita(id) {
    const [rows] = await connection.query(
        'SELECT * FROM citas WHERE id_cita = ?',
        [id]
    );

    return rows;
}

// Obtener citas de un usuario
async function obtenerCitasUsuario(usuarioId) {
    const [rows] = await connection.query(
        'SELECT * FROM citas WHERE usuario_id = ?',
        [usuarioId]
    );

    return rows;
}

// Crear cita
async function crearCita(
    usuarioId,
    servicioId,
    fecha,
    hora
) {
    const [result] = await connection.query(
        `INSERT INTO citas
        (usuario_id, servicio_id, fecha, hora, estado)
        VALUES (?, ?, ?, ?, 'pendiente')`,
        [
            usuarioId,
            servicioId,
            fecha,
            hora
        ]
    );

    return result.insertId;
}

// Actualizar estado de una cita
async function actualizarEstado(id, estado) {
    const [result] = await connection.query(
        `UPDATE citas
        SET estado = ?
        WHERE id_cita = ?`,
        [estado, id]
    );

    return result.affectedRows;
}

// Eliminar cita
async function eliminarCita(id) {
    const [result] = await connection.query(
        'DELETE FROM citas WHERE id_cita = ?',
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    obtenerCitas,
    obtenerCita,
    obtenerCitasUsuario,
    crearCita,
    actualizarEstado,
    eliminarCita
};