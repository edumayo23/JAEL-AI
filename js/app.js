// ============================================================
// 1. CARGAR CONTENIDO DEL JSON Y PINTARLO EN EL HTML
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    fetch("data/data.json")
        .then(res => res.json())
        .then(data => {
            cargarIntro(data.intro);
            cargarHero(data.hero);
            cargarCaracteristicas(data.caracteristicas);
            cargarProblema(data.problema);
        })
        .catch(err => console.error("Error cargando JSON:", err));
});

// ---------- TEXTOS INICIALES ----------
function cargarIntro(data) {
    document.getElementById("tituloIntro").textContent = data.titulo;
    document.getElementById("subtituloIntro").textContent = data.subtitulo;
}

// ---------- HERO ----------
function cargarHero(data) {
    document.getElementById("descripcionHero").textContent = data.descripcion;

    const ul = document.getElementById("beneficios");
    ul.innerHTML = "";

    data.beneficios.forEach(b => {
        const li = document.createElement("li");
        li.textContent = "✅ " + b;
        ul.appendChild(li);
    });
}

// ---------- CARACTERISTICAS ----------
function cargarCaracteristicas(data) {
    document.getElementById("pregunta").textContent = data.titulo;
    document.getElementById("subPregunta").textContent = data.subtitulo;

    const grid = document.getElementById("caracteristicasGrid");
    grid.innerHTML = "";

    data.items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("feature-card");

        card.innerHTML = `
            <h3>${item.titulo}</h3>
            <p>${item.desc}</p>
        `;

        grid.appendChild(card);
    });
}

// ---------- PROBLEMA ----------
function cargarProblema(data) {
    document.getElementById("tituloProblema").textContent = data.titulo;
    document.getElementById("textoProblema").textContent = data.texto;
}



// ============================================================
// 2. FORMULARIO PRINCIPAL: GENERADOR DE ESTRUCTURA CON IA
// ============================================================

const form = document.getElementById("generatorForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener campos
    const imagen = document.getElementById("imagen").files[0];
    const objetivo = document.getElementById("objetivo").value;

    if (!imagen) {
        alert("Debes subir una imagen.");
        return;
    }

    // MOSTRAR MENSAJE DE CARGA
    alert("Procesando con IA...");

    // COMO NO HAY BACKEND, SIMULAMOS EL RESULTADO
    setTimeout(() => {
        const resultado = generarResultadoIA(objetivo);

        alert(
            "✅ Resultado generado:\n\n" +
            resultado
        );
    }, 1500);
});


// ---------------- FUNCIÓN DE RESULTADO SIMULADO ----------------
function generarResultadoIA(objetivo) {
    const estructuras = {
        "Reconocimiento": "Estructura optimizada para alcance masivo, audiencias amplias y CPM mínimo.",
        "Interacción": "Campaña diseñada para reacciones, comentarios y mensajes. Ideal para engagement.",
        "Clientes Potenciales": "Estructura con formularios instantáneos, lookalikes y optimización para conversiones."
    };

    return estructuras[objetivo] || "Estructura personalizada generada por IA.";
}



// ============================================================
// 3. FORMULARIO DE DEMO (NO FUNCIONAL)
// ============================================================

document.getElementById("demoForm").addEventListener("submit", e => {
    e.preventDefault();
    alert("✨ Gracias por tu interés. Te contactaremos pronto.");
});
