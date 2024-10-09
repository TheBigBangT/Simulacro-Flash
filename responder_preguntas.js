let preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
let indicePreguntaActual = 0;
let puntos = 0;
const tiempoLimite = 5 * 60 * 1000; // 5 minutos en milisegundos

function mostrarPreguntas() {
    const contenedorPreguntas = document.getElementById('preguntas');
    contenedorPreguntas.innerHTML = ''; // Limpiar contenido previo

    const preguntasAGuardar = [];

    for (let i = 0; i < 3; i++) {
        if (indicePreguntaActual < preguntas.length) {
            const preguntaObj = preguntas[indicePreguntaActual];
            const preguntaDiv = document.createElement('div');

            preguntaDiv.innerHTML = `<h3>${preguntaObj.pregunta}</h3>`;
            preguntaObj.respuestas.forEach((respuesta, index) => {
                preguntaDiv.innerHTML += `<label><input type="radio" name="respuesta${i}" value="${respuesta}"> ${respuesta}</label><br>`;
            });
            contenedorPreguntas.appendChild(preguntaDiv);
            preguntasAGuardar.push(preguntaObj);
            indicePreguntaActual++;
        }
    }

    iniciarTemporizador(preguntasAGuardar);
}

function iniciarTemporizador(preguntasAGuardar) {
    setTimeout(() => {
        // Si el tiempo se agota, asignar puntaje 0 a las preguntas no respondidas
        preguntasAGuardar.forEach(() => {
            // Aquí puedes manejar cómo se registran las respuestas no respondidas
        });
        // Mostrar mensaje y cargar siguiente grupo de preguntas
        alert("Tiempo agotado para responder. Las preguntas no respondidas tienen puntaje 0.");
        mostrarPreguntas();
    }, tiempoLimite);
}

function siguientePreguntas() {
    mostrarPreguntas(); // Solo muestra la siguiente ronda de preguntas
}

document.getElementById('siguiente').onclick = siguientePreguntas;

// Inicializar la visualización de preguntas al cargar la página
mostrarPreguntas();
