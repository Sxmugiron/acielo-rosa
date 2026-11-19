const { Router } = require('express');
const axios = require('axios');

const router = Router();

const pagosvModel = require('../models/pagosvModel');

const CITAS_URL = process.env.CITAS_URL || 'http://localhost:3003';


// ======================================================
// OBTENER TODOS LOS PAGOS
// ======================================================

router.get('/api/pagosv', async (req, res) => {

    try {

        const pagos =
            await pagosvModel.obtenerPagos();

        res.status(200).json(pagos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener pagos'
        });

    }

});


// ======================================================
// OBTENER PAGO POR ID
// ======================================================

router.get('/api/pagosv/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const pago =
            await pagosvModel.obtenerPago(id);

        if (!pago) {

            return res.status(404).json({
                error: 'Pago no encontrado'
            });

        }

        res.status(200).json(pago);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener pago'
        });

    }

});


// ======================================================
// CREAR PAGO
// ======================================================

router.post('/api/pagosv', async (req, res) => {

    try {

        const {
            idcita,
            valor,
            estado,
            fecha_hora,
            comprobante
        } = req.body;


        if (!idcita || valor === undefined) {

            return res.status(400).json({
                error: 'idcita y valor son obligatorios'
            });

        }


        const estadosPermitidos = [
            'pendiente',
            'pagado',
            'rechazado'
        ];


        const estadoFinal =
            estado || 'pendiente';


        if (!estadosPermitidos.includes(estadoFinal)) {

            return res.status(400).json({
                error: 'Estado de pago no válido'
            });

        }


        const idPago =
            await pagosvModel.crearPago(
                idcita,
                valor,
                estadoFinal,
                fecha_hora || null,
                comprobante || ''
            );


        // ==================================================
        // SI SE CREA UN PAGO CON ESTADO DEFINITIVO,
        // ACTUALIZAMOS TAMBIÉN LA CITA
        // ==================================================

        let estadoCita;

        if (estadoFinal === 'pagado') {

            estadoCita = 'confirmada';

        } else if (estadoFinal === 'rechazado') {

            estadoCita = 'cancelada';

        } else {

            estadoCita = 'pendiente';

        }


        try {

            await axios.put(
                `${CITAS_URL}/api/citas/${idcita}`,
                {
                    estado: estadoCita
                }
            );


            console.log(
                `Cita ${idcita} actualizada a ${estadoCita}`
            );

        } catch (error) {

            console.error(
                'El pago se creó correctamente, pero no se pudo actualizar la cita:',
                error.response?.data || error.message
            );

        }


        res.status(201).json({

            mensaje: 'Pago creado con éxito',

            idpago: idPago,

            idcita: idcita,

            estado: estadoFinal,

            estado_cita: estadoCita

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al crear pago'
        });

    }

});


// ======================================================
// EDITAR PAGO
// ======================================================

router.put('/api/pagosv/:id', async (req, res) => {

    try {

        const { id } = req.params;


        const {
            idcita,
            valor,
            estado,
            fecha_hora,
            comprobante
        } = req.body;


        // ==================================================
        // VALIDAR ESTADO DEL PAGO
        // ==================================================

        const estadosPermitidos = [
            'pendiente',
            'pagado',
            'rechazado'
        ];


        if (!estadosPermitidos.includes(estado)) {

            return res.status(400).json({
                error: 'Estado de pago no válido'
            });

        }


        // ==================================================
        // ACTUALIZAR PAGO
        // ==================================================

        const resultado =
            await pagosvModel.editarPago(
                id,
                idcita,
                valor,
                estado,
                fecha_hora,
                comprobante
            );


        if (resultado === 0) {

            return res.status(404).json({
                error: 'Pago no encontrado'
            });

        }


        // ==================================================
        // DETERMINAR ESTADO DE LA CITA
        // ==================================================

        let estadoCita;


        if (estado === 'pagado') {

            estadoCita = 'confirmada';

        } else if (estado === 'rechazado') {

            estadoCita = 'cancelada';

        } else {

            estadoCita = 'pendiente';

        }


        // ==================================================
        // ACTUALIZAR CITA
        // ==================================================

        try {

            await axios.put(

                `${CITAS_URL}/api/citas/${idcita}`,

                {
                    estado: estadoCita
                }

            );


            console.log(
                `Cita ${idcita} actualizada a ${estadoCita}`
            );


        } catch (error) {

            console.error(

                'El pago se actualizó, pero no se pudo actualizar la cita:',

                error.response?.data || error.message

            );

        }


        // ==================================================
        // RESPUESTA
        // ==================================================

        res.status(200).json({

            mensaje:
                'Pago actualizado correctamente',

            idpago:
                id,

            idcita:
                idcita,

            estado_pago:
                estado,

            estado_cita:
                estadoCita

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al actualizar pago'
        });

    }

});


// ======================================================
// ELIMINAR PAGO
// ======================================================

router.delete('/api/pagosv/:id', async (req, res) => {

    try {

        const { id } = req.params;


        const resultado =
            await pagosvModel.eliminarPago(id);


        if (resultado === 0) {

            return res.status(404).json({
                error: 'Pago no encontrado'
            });

        }


        res.status(200).json({
            mensaje: 'Pago eliminado correctamente'
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al eliminar pago'
        });

    }

});

module.exports = router; 