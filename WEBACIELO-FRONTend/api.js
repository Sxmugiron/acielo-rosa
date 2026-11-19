const API = {
    usuarios: "http://192.168.100.3:5080/api/usuarios",
    servicios: "http://192.168.100.3:5080/api/servicios",
    citas: "http://192.168.100.3:5080/api/citas",
    pagos: "http://192.168.100.3:5080/api/pagosv",

    analisis: "http://192.168.100.3:5080/api/analisis",
    analisisAvanzado: "http://192.168.100.3:5080/api/analisis/avanzado",
    graficas: {
        asistencia: "http://192.168.100.3:5080/api/analisis/graficas/asistencia",
        edad: "http://192.168.100.3:5080/api/analisis/graficas/edad",
        sms: "http://192.168.100.3:5080/api/analisis/graficas/sms",
        dias: "http://192.168.100.3:5080/api/analisis/graficas/dias"
    }
};

async function obtenerDatos(url) {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error("Error en la solicitud");
    }

    return await respuesta.json();
}

async function enviarDatos(url, metodo, datos) {
    const respuesta = await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(resultado.mensaje || "Error en la solicitud");
    }

    return resultado;
}
