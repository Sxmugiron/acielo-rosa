const express = require('express');
const citasController = require('./controllers/citasController');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(citasController);

const PORT = 3003;

app.listen(PORT, '0.0.0.0', () => {
    console.log(
        `Microservicio Citas corriendo en el puerto ${PORT}`
    );
});