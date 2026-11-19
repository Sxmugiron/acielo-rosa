const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const usuariosController = require('./controllers/usuariosController');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Obtener todos los usuarios
app.get('/api/usuarios', usuariosController.obtenerUsuarios);

// Obtener usuario por ID
app.get('/api/usuarios/:id', usuariosController.obtenerUsuario);

// Crear usuario
app.post('/api/usuarios', usuariosController.crearUsuario);

// Login
app.post('/api/usuarios/login', usuariosController.login);

// Actualizar usuario
app.put('/api/usuarios/:id', usuariosController.actualizarUsuario);

// Eliminar usuario
app.delete('/api/usuarios/:id', usuariosController.eliminarUsuario);

const PORT = 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Microservicio Usuarios corriendo en el puerto ${PORT}`);
});