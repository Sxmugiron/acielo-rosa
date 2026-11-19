const { Router } = require('express');
const router = Router();

const serviciosModel = require('../models/serviciosModel');

// Obtener todos los servicios
router.get('/api/servicios', async (req, res) => {
    try {

        const servicios =
            await serviciosModel.obtenerServicios();

        res.status(200).json(servicios);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener servicios'
        });
    }
});

// Obtener servicio por ID
router.get('/api/servicios/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const servicio =
            await serviciosModel.obtenerServicio(id);

        if (servicio.length === 0) {
            return res.status(404).json({
                error: 'Servicio no encontrado'
            });
        }

        res.status(200).json(servicio[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al obtener servicio'
        });
    }
});

// Crear servicio
router.post('/api/servicios', async (req, res) => {
    try {

        const {
            nombre,
            descripcion,
            precio,
            cupo_mensual
        } = req.body;

        if (!nombre || precio === undefined) {
            return res.status(400).json({
                error: 'Nombre y precio son obligatorios'
            });
        }

        const cupoMensual =
            cupo_mensual || 15;

        if (cupoMensual <= 0) {
            return res.status(400).json({
                error: 'El cupo mensual debe ser mayor a 0'
            });
        }

        const servicioId =
            await serviciosModel.crearServicio(
                nombre,
                descripcion,
                precio,
                cupoMensual
            );

        const fecha = new Date();

        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();

        await serviciosModel.crearCupoMensual(
            servicioId,
            mes,
            anio,
            cupoMensual
        );

        res.status(201).json({
            mensaje: 'Servicio creado con éxito',
            id: servicioId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al crear servicio'
        });
    }
});

// Editar servicio
router.put('/api/servicios/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const {
            nombre,
            descripcion,
            precio,
            cupo_mensual
        } = req.body;

        const resultado =
            await serviciosModel.editarServicio(
                id,
                nombre,
                descripcion,
                precio,
                cupo_mensual
            );

        if (resultado === 0) {
            return res.status(404).json({
                error: 'Servicio no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Servicio actualizado con éxito'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Error al actualizar servicio'
        });
    }
});

// Obtener disponibilidad mensual
router.get(
    '/api/servicios/:id/disponibilidad',
    async (req, res) => {

        try {

            const { id } = req.params;

            const fecha = req.query.fecha;

            let mes;
            let anio;

            if (fecha) {

                const fechaSeleccionada =
                    new Date(fecha + 'T00:00:00');

                mes =
                    fechaSeleccionada.getMonth() + 1;

                anio =
                    fechaSeleccionada.getFullYear();

            } else {

                const hoy = new Date();

                mes = hoy.getMonth() + 1;
                anio = hoy.getFullYear();
            }

            const cupo =
                await serviciosModel.asegurarCupoMensual(
                    id,
                    mes,
                    anio
                );

            if (!cupo) {
                return res.status(404).json({
                    error: 'Servicio no encontrado'
                });
            }

            res.status(200).json({
                servicio_id: id,
                mes,
                anio,
                cupos_totales: cupo.cupos_totales,
                cupos_disponibles: cupo.cupos_disponibles
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: 'Error al consultar disponibilidad'
            });
        }
    }
);

// Reservar un cupo mensual
router.post(
    '/api/servicios/:id/reservar',
    async (req, res) => {

        try {

            const { id } = req.params;
            const { fecha } = req.body;

            if (!fecha) {
                return res.status(400).json({
                    error: 'La fecha es obligatoria'
                });
            }

            const fechaSeleccionada =
                new Date(fecha + 'T00:00:00');

            const mes =
                fechaSeleccionada.getMonth() + 1;

            const anio =
                fechaSeleccionada.getFullYear();

            const resultado =
                await serviciosModel.reservarCupo(
                    id,
                    mes,
                    anio
                );

            if (resultado.error) {
                return res.status(400).json(resultado);
            }

            const cupo = resultado[0];

            res.status(200).json({
                mensaje: 'Cupo reservado correctamente',
                servicio_id: id,
                mes,
                anio,
                cupos_totales: cupo.cupos_totales,
                cupos_disponibles: cupo.cupos_disponibles
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: 'Error al reservar cupo'
            });
        }
    }
);

module.exports = router;