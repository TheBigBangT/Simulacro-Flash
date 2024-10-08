let puntuacion = 0;

function cargarPreguntas() {
    const preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
    const preguntasDiv = document.getElementById('preguntas');

    preguntas.forEach((preguntaObj, index) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.innerHTML = `<h3>${preguntaObj.pregunta}</h3>`;

        // Crear botones para cada opción de respuesta
        preguntaObj.respuestas.forEach((respuesta, i) => {
            const boton = document.createElement('button');
            boton.innerText = respuesta;
            boton.addEventListener('click', function() {
                verificarRespuesta(respuesta, preguntaObj.respuestaCorrecta, boton);
            });
            preguntaDiv.appendChild(boton);
        });

        preguntasDiv.appendChild(preguntaDiv);
    });
}

function verificarRespuesta(respuestaSeleccionada, respuestaCorrecta, boton) {
    if (respuestaSeleccionada === respuestaCorrecta) {
        alert("¡Respuesta correcta!");
        puntuacion += 10;
    } else {
        alert("Respuesta incorrecta.");
        puntuacion -= 2;
    }

    // Actualizar la puntuación
    document.getElementById('puntuacion').innerText = `Puntuación: ${puntuacion}`;
    
    // Desactivar el botón para evitar múltiples respuestas
    boton.disabled = true;
}

// Cargar las preguntas cuando la página se cargue
window.onload = cargarPreguntas;


