const { Router } = require('express');
const axios = require('axios');

const router = Router();

const citasModel = require('../models/citasmodels');

const USUARIOS_URL = process.env.USUARIOS_URL || 'http://localhost:3001';
const SERVICIOS_URL = process.env.SERVICIOS_URL || 'http://localhost:3002';
const PAGOS_URL = process.env.PAGOS_URL || 'http://localhost:3004';


// ======================================================
// OBTENER TODAS LAS CITAS
// ======================================================

router.get('/api/citas', async (req, res) => {
    try {

        const citas = await citasModel.obtenerCitas();

        res.status(200).json(citas);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener las citas'
        });
    }
});


// ======================================================
// OBTENER CITAS DE UN USUARIO
// IMPORTANTE: ESTA RUTA VA ANTES DE /:id
// ======================================================

router.get('/api/citas/usuario/:usuarioId', async (req, res) => {
    try {

        const { usuarioId } = req.params;

        const citas = await citasModel.obtenerCitasUsuario(usuarioId);

        res.status(200).json(citas);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener las citas del usuario'
        });
    }
});


// ======================================================
// OBTENER UNA CITA POR ID
// ======================================================

router.get('/api/citas/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const cita = await citasModel.obtenerCita(id);

        if (!cita) {
            return res.status(404).json({
                error: 'Cita no encontrada'
            });
        }

        res.status(200).json(cita);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener la cita'
        });
    }
});


// ======================================================
// CREAR UNA CITA
// ======================================================

router.post('/api/citas', async (req, res) => {

    try {

        const {
            usuario_id,
            servicio_id,
            fecha,
            hora
        } = req.body;


        // ----------------------------------------------
        // VALIDAR DATOS
        // ----------------------------------------------

        if (!usuario_id || !servicio_id || !fecha || !hora) {

            return res.status(400).json({
                error: 'usuario_id, servicio_id, fecha y hora son obligatorios'
            });
        }


        // ----------------------------------------------
        // VALIDAR USUARIO
        // ----------------------------------------------

        let usuario;

        try {

            const respuestaUsuario = await axios.get(
                `${USUARIOS_URL}/api/usuarios/${usuario_id}`
            );

            usuario = respuestaUsuario.data;

        } catch (error) {

            return res.status(400).json({
                error: 'El usuario no existe'
            });
        }


        // ----------------------------------------------
        // VALIDAR SERVICIO
        // ----------------------------------------------

        let servicio;

        try {

            const respuestaServicio = await axios.get(
                `${SERVICIOS_URL}/api/servicios/${servicio_id}`
            );

            servicio = respuestaServicio.data;

        } catch (error) {

            return res.status(400).json({
                error: 'El servicio no existe'
            });
        }


        // ----------------------------------------------
        // RESERVAR CUPO MENSUAL
        // ----------------------------------------------

        let disponibilidad;

        try {

            const respuestaCupo = await axios.post(
                `${SERVICIOS_URL}/api/servicios/${servicio_id}/reservar`,
                {
                    fecha: fecha
                }
            );

            disponibilidad = respuestaCupo.data;

        } catch (error) {

            console.error(error.response?.data || error.message);

            return res.status(400).json({
                error: 'No hay cupos disponibles para este servicio'
            });
        }


        // ----------------------------------------------
        // CREAR CITA EN SU PROPIA BASE DE DATOS
        // ----------------------------------------------

        const idCita = await citasModel.crearCita(
            usuario_id,
            servicio_id,
            fecha,
            hora
        );


        // ----------------------------------------------
        // CREAR PAGO PENDIENTE
        // ----------------------------------------------

        try {

            await axios.post(
                `${PAGOS_URL}/api/pagosv`,
                {
                    idcita: idCita,
                    valor: servicio.precio,
                    estado: 'pendiente',
                    fecha_hora: new Date(),
                    comprobante: ''
                }
            );

        } catch (error) {

            console.error(
                'Error al crear el pago:',
                error.response?.data || error.message
            );

        }


        // ----------------------------------------------




        // RESPUESTA FINAL
        // ----------------------------------------------

        res.status(201).json({

            mensaje: 'Cita creada correctamente',

            id_cita: idCita,

            usuario_id: usuario_id,

            servicio_id: servicio_id,

            fecha: fecha,

            hora: hora,

            estado: 'pendiente',

            cupos_disponibles:
                disponibilidad.cupos_disponibles ??
                disponibilidad.disponibles ??
                null

        });


    } catch (error) {

        console.error('Error al crear la cita:', error);

        res.status(500).json({
            error: 'Error del servidor al crear la cita'
        });

    }

});


// ======================================================
// ACTUALIZAR ESTADO DE UNA CITA
// ======================================================

router.put('/api/citas/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const { estado } = req.body;


        const estadosPermitidos = [
            'pendiente',
            'confirmada',
            'cancelada',
            'completada'
        ];


        if (!estadosPermitidos.includes(estado)) {

            return res.status(400).json({
                error: 'Estado no válido'
            });
        }


        const resultado =
            await citasModel.actualizarEstado(id, estado);


        if (resultado === 0) {

            return res.status(404).json({
                error: 'Cita no encontrada'
            });
        }


        res.status(200).json({
            mensaje: 'Estado de la cita actualizado correctamente'
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al actualizar la cita'
        });

    }

});


// ======================================================
// ELIMINAR CITA
// ======================================================

router.delete('/api/citas/:id', async (req, res) => {

    try {

        const { id } = req.params;


        const resultado =
            await citasModel.eliminarCita(id);


        if (resultado === 0) {

            return res.status(404).json({
                error: 'Cita no encontrada'
            });
        }


        res.status(200).json({
            mensaje: 'Cita eliminada correctamente'
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al eliminar la cita'
        });

    }

});


module.exports = router;