const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'serviciosacielo'
});

// Obtener todos los servicios
async function obtenerServicios() {
    const [rows] = await connection.query(
        'SELECT * FROM servicios'
    );

    return rows;
}

// Obtener un servicio por ID
async function obtenerServicio(id) {
    const [rows] = await connection.query(
        'SELECT * FROM servicios WHERE id = ?',
        [id]
    );

    return rows;
}

// Crear servicio
async function crearServicio(
    nombre,
    descripcion,
    precio,
    cupoMensual
) {
    const [result] = await connection.query(
        `INSERT INTO servicios
        (nombre, descripcion, precio, cupo_mensual)
        VALUES (?, ?, ?, ?)`,
        [nombre, descripcion, precio, cupoMensual]
    );

    return result.insertId;
}

// Crear cupo mensual
async function crearCupoMensual(
    servicioId,
    mes,
    anio,
    cuposTotales
) {
    const [result] = await connection.query(
        `INSERT INTO cupos_mensuales
        (servicio_id, mes, anio, cupos_totales, cupos_disponibles)
        VALUES (?, ?, ?, ?, ?)`,
        [servicioId, mes, anio, cuposTotales, cuposTotales]
    );

    return result.insertId;
}

// Obtener cupo de un mes
async function obtenerCupoMensual(
    servicioId,
    mes,
    anio
) {
    const [rows] = await connection.query(
        `SELECT *
        FROM cupos_mensuales
        WHERE servicio_id = ?
        AND mes = ?
        AND anio = ?`,
        [servicioId, mes, anio]
    );

    return rows;
}

// Crear automáticamente el cupo del mes si no existe
async function asegurarCupoMensual(
    servicioId,
    mes,
    anio
) {
    let cupo = await obtenerCupoMensual(
        servicioId,
        mes,
        anio
    );

    if (cupo.length > 0) {
        return cupo[0];
    }

    const servicio = await obtenerServicio(servicioId);

    if (servicio.length === 0) {
        return null;
    }

    const cuposTotales = servicio[0].cupo_mensual;

    await crearCupoMensual(
        servicioId,
        mes,
        anio,
        cuposTotales
    );

    cupo = await obtenerCupoMensual(
        servicioId,
        mes,
        anio
    );

    return cupo[0];
}

// Reservar un cupo
async function reservarCupo(
    servicioId,
    mes,
    anio
) {
    const cupo = await asegurarCupoMensual(
        servicioId,
        mes,
        anio
    );

    if (!cupo) {
        return {
            error: 'Servicio no encontrado'
        };
    }

    if (cupo.cupos_disponibles <= 0) {
        return {
            error: 'No hay cupos disponibles para este mes'
        };
    }

    await connection.query(
        `UPDATE cupos_mensuales
        SET cupos_disponibles = cupos_disponibles - 1
        WHERE servicio_id = ?
        AND mes = ?
        AND anio = ?
        AND cupos_disponibles > 0`,
        [servicioId, mes, anio]
    );

    return await obtenerCupoMensual(
        servicioId,
        mes,
        anio
    );
}

// Editar servicio
async function editarServicio(
    id,
    nombre,
    descripcion,
    precio,
    cupoMensual
) {
    const [result] = await connection.query(
        `UPDATE servicios
        SET nombre = ?,
            descripcion = ?,
            precio = ?,
            cupo_mensual = ?
        WHERE id = ?`,
        [
            nombre,
            descripcion,
            precio,
            cupoMensual,
            id
        ]
    );

    return result.affectedRows;
}

// Eliminar servicio
async function eliminarServicio(id) {

    await connection.query(
        'DELETE FROM cupos_mensuales WHERE servicio_id = ?',
        [id]
    );

    const [result] = await connection.query(
        'DELETE FROM servicios WHERE id = ?',
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    obtenerServicios,
    obtenerServicio,
    crearServicio,
    crearCupoMensual,
    obtenerCupoMensual,
    asegurarCupoMensual,
    reservarCupo,
    editarServicio,
    eliminarServicio
};