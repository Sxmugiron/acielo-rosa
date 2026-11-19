const express = require('express');
const pagosvController = require('./controllers/pagosvController');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(pagosvController);

const PORT = 3004;

app.listen(PORT, '0.0.0.0', () => {
    console.log(
        `Microservicio Pagos corriendo en el puerto ${PORT}`
    );
});