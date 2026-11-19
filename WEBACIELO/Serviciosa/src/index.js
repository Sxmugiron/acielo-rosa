const express = require('express');
const serviciosController = require('./controllers/serviciosController');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(serviciosController);

const PORT = 3002;

app.listen(PORT, '0.0.0.0', () => {
    console.log(
        `Microservicio Servicios corriendo en el puerto ${PORT}`
    );
});