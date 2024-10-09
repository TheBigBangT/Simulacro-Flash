let preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
let indicePreguntaActual = 0;
let puntos = 0;
const tiempoLimite = 5 * 60 * 1000; // 5 minutos en milisegundos
let temporizador; // Variable para el temporizador
let tiempoRestante = tiempoLimite; // Almacenar tiempo restante
let preguntasIncorrectas = []; // Almacena preguntas incorrectas
let conteoIncorrectas = {}; // Almacena cuántas veces se respondió mal

// Función para mezclar preguntas aleatoriamente
function mezclarPreguntas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para mostrar las preguntas
function mostrarPreguntas() {
    const contenedorPreguntas = document.getElementById('preguntas');
    contenedorPreguntas.innerHTML = ''; // Limpiar contenido previo

    for (let i = 0; i < 3; i++) {
        if (indicePreguntaActual < preguntas.length) {
            const preguntaObj = preguntas[indicePreguntaActual];
            const preguntaDiv = document.createElement('div');

            preguntaDiv.innerHTML = `<h3>${preguntaObj.pregunta}</h3>`;
            preguntaObj.respuestas.forEach((respuesta) => {
                preguntaDiv.innerHTML += `<label><input type="radio" name="respuesta${indicePreguntaActual}" value="${respuesta}"> ${respuesta}</label><br>`;
            });
            contenedorPreguntas.appendChild(preguntaDiv);
            indicePreguntaActual++;
        }
    }

    if (indicePreguntaActual >= preguntas.length) {
        document.getElementById('siguiente').style.display = 'none';
        alert("Has respondido todas las preguntas.");
    }
}

// Función para iniciar el temporizador
function iniciarTemporizador() {
    temporizador = setInterval(() => {
        tiempoRestante -= 1000; // Reducir el tiempo restante en 1 segundo
        const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);
        document.getElementById('temporizador').textContent = `Tiempo restante: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            alert("Se acabó el tiempo.");
            puntuarPreguntas();
        }
    }, 1000);
}

// Función para puntuar las respuestas
function puntuarPreguntas() {
    const respuestasSeleccionadas = document.querySelectorAll('input[type="radio"]:checked');

    respuestasSeleccionadas.forEach((respuesta) => {
        const preguntaIndex = parseInt(respuesta.name.replace('respuesta', ''), 10);
        if (respuesta.value === preguntas[preguntaIndex].respuestaCorrecta) {
            puntos += 5; // Sumar 5 puntos por respuesta correcta
            alert(`¡Correcto! Has ganado 5 puntos. Respuesta: ${respuesta.value}`);
        } else {
            puntos -= 3; // Restar 3 puntos por respuesta incorrecta
            preguntasIncorrectas.push(preguntas[preguntaIndex]);
            conteoIncorrectas[preguntas[preguntaIndex].pregunta] = (conteoIncorrectas[preguntas[preguntaIndex].pregunta] || 0) + 1;
            alert(`Incorrecto. Has perdido 3 puntos. La respuesta correcta era: ${preguntas[preguntaIndex].respuestaCorrecta}`);
        }
    });

    document.getElementById('puntuacion').textContent = `Puntuación: ${puntos}`;
    mostrarPreguntas();
}

// Inicialización
mostrarPreguntas();
iniciarTemporizador();

// Evento para el botón siguiente
document.getElementById('siguiente').addEventListener('click', function() {
    puntuarPreguntas();
});

// Mostrar preguntas incorrectas
document.getElementById('validar').addEventListener('click', function() {
    const contenedorPractica = document.getElementById('practica');
    contenedorPractica.innerHTML = ''; // Limpiar contenido previo
    preguntasIncorrectas.forEach(pregunta => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.innerHTML = `<h3>${pregunta.pregunta}</h3>`;
        pregunta.respuestas.forEach(respuesta => {
            preguntaDiv.innerHTML += `<label><input type="radio" name="respuestaIncorrecta${pregunta.pregunta}" value="${respuesta}"> ${respuesta}</label><br>`;
        });
        contenedorPractica.appendChild(preguntaDiv);
    });
    document.getElementById('validar').style.display = 'block';
});

// Validar respuestas incorrectas
document.getElementById('validar').addEventListener('click', function() {
    preguntasIncorrectas.forEach(pregunta => {
        const selectedAnswer = document.querySelector(`input[name="respuestaIncorrecta${pregunta.pregunta}"]:checked`);
        if (selectedAnswer && selectedAnswer.value === pregunta.respuestaCorrecta) {
            alert(`¡Correcto! Respuesta correcta para: ${pregunta.pregunta}`);
        } else {
            alert(`Incorrecto. La respuesta correcta era: ${pregunta.respuestaCorrecta}`);
        }
    });
});
