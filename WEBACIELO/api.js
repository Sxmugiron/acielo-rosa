const API = {
    usuarios: "http://192.168.100.3:3001/api/usuarios",
    servicios: "http://192.168.100.3:3002/api/servicios",
    citas: "http://192.168.100.3:3003/api/citas",
    pagos: "http://192.168.100.3:3004/api/pagosv",
    notificaciones: "http://192.168.100.3:3000/api/notificaciones"
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