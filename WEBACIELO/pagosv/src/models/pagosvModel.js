const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pagosv'
});


// ======================================================
// OBTENER TODOS LOS PAGOS
// ======================================================

async function obtenerPagos() {

    const [result] = await connection.query(
        'SELECT * FROM pagosv ORDER BY fecha_hora DESC'
    );

    return result;
}


// ======================================================
// OBTENER UN PAGO POR ID
// ======================================================

async function obtenerPago(id) {

    const [result] = await connection.query(
        'SELECT * FROM pagosv WHERE idpago = ?',
        [id]
    );

    return result[0];
}


// ======================================================
// CREAR PAGO
// ======================================================

async function crearPago(
    idcita,
    valor,
    estado,
    fecha_hora,
    comprobante
) {

    let fechaMySQL;

    if (fecha_hora) {

        const fecha = new Date(fecha_hora);

        fechaMySQL = fecha
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

    } else {

        const fecha = new Date();

        fechaMySQL = fecha
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
    }


    const [result] = await connection.query(
        `INSERT INTO pagosv
        (idcita, valor, estado, fecha_hora, comprobante)
        VALUES (?, ?, ?, ?, ?)`,
        [
            idcita,
            valor,
            estado,
            fechaMySQL,
            comprobante
        ]
    );


    return result.insertId;
}


// ======================================================
// EDITAR PAGO
// ======================================================

async function editarPago(
    id,
    idcita,
    valor,
    estado,
    fecha_hora,
    comprobante
) {

    let fechaMySQL;

    if (fecha_hora) {

        const fecha = new Date(fecha_hora);

        fechaMySQL = fecha
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

    } else {

        fechaMySQL = null;
    }


    const [result] = await connection.query(
        `UPDATE pagosv
        SET idcita = ?,
            valor = ?,
            estado = ?,
            fecha_hora = ?,
            comprobante = ?
        WHERE idpago = ?`,
        [
            idcita,
            valor,
            estado,
            fechaMySQL,
            comprobante,
            id
        ]
    );


    return result.affectedRows;
}


// ======================================================
// ELIMINAR PAGO
// ======================================================

async function eliminarPago(id) {

    const [result] = await connection.query(
        'DELETE FROM pagosv WHERE idpago = ?',
        [id]
    );

    return result.affectedRows;
}


// ======================================================
// EXPORTAR FUNCIONES
// ======================================================

module.exports = {
    obtenerPagos,
    obtenerPago,
    crearPago,
    editarPago,
    eliminarPago
};