document.addEventListener("DOMContentLoaded", () => {
    const imagenes = document.querySelectorAll(".grafica img");

    const modal = document.createElement("div");
    modal.className = "spark-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Gráfica ampliada");

    modal.innerHTML = `
        <div class="spark-modal-contenido">
            <button class="spark-cerrar"
                    type="button"
                    aria-label="Cerrar gráfica">×</button>
            <h2 id="spark-modal-titulo"></h2>
            <img id="spark-modal-imagen" alt="">
        </div>
    `;

    document.body.appendChild(modal);

    const imagenGrande = document.getElementById("spark-modal-imagen");
    const tituloGrande = document.getElementById("spark-modal-titulo");
    const cerrarBoton = modal.querySelector(".spark-cerrar");

    let elementoAnterior = null;

    function abrir(imagen) {
        if (!imagen.src || !imagen.complete || imagen.naturalWidth === 0) {
            return;
        }

        elementoAnterior = document.activeElement;

        const tarjeta = imagen.closest(".grafica");
        const titulo = tarjeta?.querySelector("h3")?.textContent
            || imagen.alt;

        imagenGrande.src = imagen.src;
        imagenGrande.alt = imagen.alt;
        tituloGrande.textContent = titulo;

        modal.classList.add("abierto");
        document.body.style.overflow = "hidden";
        cerrarBoton.focus();
    }

    function cerrar() {
        modal.classList.remove("abierto");
        document.body.style.overflow = "";
        imagenGrande.removeAttribute("src");

        if (elementoAnterior) {
            elementoAnterior.focus();
        }
    }

    imagenes.forEach(imagen => {
        imagen.tabIndex = 0;
        imagen.setAttribute("role", "button");
        imagen.setAttribute("aria-label", "Ampliar " + imagen.alt);

        imagen.addEventListener("click", () => abrir(imagen));

        imagen.addEventListener("keydown", evento => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrir(imagen);
            }
        });
    });

    cerrarBoton.addEventListener("click", cerrar);

    modal.addEventListener("click", evento => {
        if (evento.target === modal) {
            cerrar();
        }
    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape" &&
            modal.classList.contains("abierto")) {
            cerrar();
        }
    });
});
