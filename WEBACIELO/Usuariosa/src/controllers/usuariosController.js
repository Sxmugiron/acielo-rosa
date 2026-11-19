const usuariosModel = require('../models/usuariosModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await usuariosModel.obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}

// Obtener un usuario
async function obtenerUsuario(req, res) {
    try {
        const { id } = req.params;
        const usuario = await usuariosModel.obtenerUsuario(id);

        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
}

// Crear usuario
async function crearUsuario(req, res) {
    try {
        const {
            nombre,
            email,
            usuario,
            password,
            telefono,
            rol
        } = req.body;

        if (!nombre || !email || !usuario || !password) {
            return res.status(400).json({
                error: 'Nombre, email, usuario y password son obligatorios'
            });
        }

        const rolFinal = rol || 'cliente';

        if (!['cliente', 'profesional'].includes(rolFinal)) {
            return res.status(400).json({
                error: 'El rol debe ser cliente o profesional'
            });
        }

        const passwordEncriptada = await bcrypt.hash(password, 10);

        const nuevoUsuario = await usuariosModel.crearUsuario(
            nombre,
            email,
            usuario,
            passwordEncriptada,
            telefono,
            rolFinal
        );

        res.status(201).json(nuevoUsuario);

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                error: 'El email o usuario ya existe'
            });
        }

        res.status(500).json({
            error: 'Error al crear usuario'
        });
    }
}

// Login
async function login(req, res) {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({
                error: 'Usuario y password son obligatorios'
            });
        }

        const usuarioEncontrado =
            await usuariosModel.obtenerUsuarioLogin(usuario);

        if (!usuarioEncontrado) {
            return res.status(401).json({
                error: 'Usuario o contraseña incorrectos'
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuarioEncontrado.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                error: 'Usuario o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            {
                id: usuarioEncontrado.id,
                usuario: usuarioEncontrado.usuario,
                rol: usuarioEncontrado.rol
            },
            'acielo_rosa_clave_secreta',
            { expiresIn: '8h' }
        );

        res.status(200).json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuarioEncontrado.id,
                nombre: usuarioEncontrado.nombre,
                email: usuarioEncontrado.email,
                usuario: usuarioEncontrado.usuario,
                telefono: usuarioEncontrado.telefono,
                rol: usuarioEncontrado.rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error en el login'
        });
    }
}

// Actualizar usuario
async function actualizarUsuario(req, res) {
    try {
        const { id } = req.params;

        const {
            nombre,
            email,
            usuario,
            telefono,
            rol
        } = req.body;

        if (rol && !['cliente', 'profesional'].includes(rol)) {
            return res.status(400).json({
                error: 'El rol debe ser cliente o profesional'
            });
        }

        const resultado = await usuariosModel.actualizarUsuario(
            id,
            nombre,
            email,
            usuario,
            telefono,
            rol
        );

        if (resultado === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Usuario actualizado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al actualizar usuario'
        });
    }
}

// Eliminar usuario
async function eliminarUsuario(req, res) {
    try {
        const { id } = req.params;

        const resultado =
            await usuariosModel.eliminarUsuario(id);

        if (resultado === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al eliminar usuario'
        });
    }
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    login,
    actualizarUsuario,
    eliminarUsuario
};