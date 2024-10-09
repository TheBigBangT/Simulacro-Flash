document.getElementById('formulario-pregunta').addEventListener('submit', function(event) {
    event.preventDefault();

    const pregunta = document.getElementById('pregunta').value;
    const respuestas = [
        document.getElementById('respuesta1').value,
        document.getElementById('respuesta2').value,
        document.getElementById('respuesta3').value,
        document.getElementById('respuesta4').value,
        document.getElementById('respuesta5').value
    ];

    const respuestaCorrecta = respuestas[0];  // La primera opción es la correcta.

    // Guardar preguntas en localStorage
    const preguntasGuardadas = JSON.parse(localStorage.getItem('preguntas')) || [];
    preguntasGuardadas.push({ pregunta, respuestas, respuestaCorrecta });
    localStorage.setItem('preguntas', JSON.stringify(preguntasGuardadas));

    // Mostrar confirmación
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<h3>Pregunta guardada: ${pregunta}</h3>`;
});
