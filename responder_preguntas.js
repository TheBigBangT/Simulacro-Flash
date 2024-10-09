let preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
let indicePreguntaActual = 0;
let puntos = 0;
const tiempoLimite = 5 * 60 * 1000; // 5 minutos en milisegundos
let temporizador; // Variable para el temporizador
let tiempoRestante = tiempoLimite; // Almacenar tiempo restante
let preguntasIncorrectas = []; // Almacena preguntas incorrectas
let conteoIncorrectas = {}; // Almacena cuántas veces se respondió mal
let indicePreguntaIncorrecta = 0;

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
    let preguntasAGuardar = [];

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

    iniciarTemporizador(); // Reiniciar el temporizador
}

// Iniciar el temporizador
function iniciarTemporizador() {
    clearTimeout(temporizador); // Limpiar el temporizador anterior
    tiempoRestante = tiempoLimite; // Reiniciar el tiempo restante
    actualizarTemporizador(); // Mostrar el tiempo restante
    temporizador = setInterval(() => {
        tiempoRestante -= 1000; // Disminuir el tiempo restante en 1 segundo
        actualizarTemporizador(); // Actualizar la visualización del temporizador

        if (tiempoRestante <= 0) {
            clearInterval(temporizador); // Detener el temporizador
            alert("Tiempo agotado para responder. Las preguntas no respondidas tienen puntaje 0.");
            siguientePreguntas();
        }
    }, 1000);
}

// Actualizar la visualización del temporizador
function actualizarTemporizador() {
    const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);
    document.getElementById('temporizador').innerText = `Tiempo restante: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}

// Evaluar respuestas
function evaluarRespuestas() {
    let respuestasCorrectas = 0;
    let respuestasIncorrectas = [];

    for (let i = 0; i < 3; i++) {
        const respuestas = document.getElementsByName(`respuesta${i}`);
        let respuestaSeleccionada = '';
        for (const respuesta of respuestas) {
            if (respuesta.checked) {
                respuestaSeleccionada = respuesta.value;
                break;
            }
        }

        if (respuestaSeleccionada) {
            const preguntaObj = preguntas[indicePreguntaActual - 3 + i];
            if (respuestaSeleccionada === preguntaObj.correcta) {
                puntos += 10; // Sumar puntos
                respuestasCorrectas++;
                // Si la respuesta fue correcta y estaba en incorrectas, disminuimos el contador
                if (conteoIncorrectas[preguntaObj.pregunta]) {
                    conteoIncorrectas[preguntaObj.pregunta]--;
                    if (conteoIncorrectas[preguntaObj.pregunta] <= 0) {
                        delete conteoIncorrectas[preguntaObj.pregunta]; // Remover si ya fue respondida correctamente
                    }
                }
            } else {
                respuestasIncorrectas.push(preguntaObj); // Guardar preguntas incorrectas
                // Aumentar contador de incorrectas
                conteoIncorrectas[preguntaObj.pregunta] = (conteoIncorrectas[preguntaObj.pregunta] || 0) + 1;
            }
        }
    }

    if (respuestasCorrectas > 0) {
        alert(`¡Respuestas correctas! Ganaste ${respuestasCorrectas * 10} puntos.`);
    } else {
        alert('No obtuviste respuestas correctas.');
    }

    preguntasIncorrectas.push(...respuestasIncorrectas); // Agregar preguntas incorrectas al array
    document.getElementById('puntuacion').innerText = `Puntuación: ${puntos}`; // Mostrar puntuación
    siguientePreguntas(); // Mostrar siguiente conjunto de preguntas
}

// Función para pasar a las siguientes preguntas
function siguientePreguntas() {
    // Mezclar preguntas para que aparezcan en un orden aleatorio
    preguntas = mezclarPreguntas(preguntas);
    mostrarPreguntas(); // Mostrar nuevas preguntas
}

// Nueva funcionalidad para responder preguntas incorrectas
function cargarPreguntasIncorrectas() {
    const contenedorIncorrectas = document.getElementById('practica');
    contenedorIncorrectas.innerHTML = ''; // Limpiar contenido previo

    if (preguntasIncorrectas.length > 0 && indicePreguntaIncorrecta < preguntasIncorrectas.length) {
        const preguntaObj = preguntasIncorrectas[indicePreguntaIncorrecta];
        const preguntaDiv = document.createElement('div');

        preguntaDiv.innerHTML = `<h3>${preguntaObj.pregunta}</h3>`;
        preguntaObj.respuestas.forEach((respuesta) => {
            preguntaDiv.innerHTML += `<label><input type="radio" name="respuestaIncorrecta" value="${respuesta}"> ${respuesta}</label><br>`;
        });
        contenedorIncorrectas.appendChild(preguntaDiv);
        document.getElementById('validar').style.display = 'block'; // Mostrar botón de validar
    } else {
        contenedorIncorrectas.innerHTML = '<h4>No hay preguntas incorrectas pendientes.</h4>';
        document.getElementById('validar').style.display = 'none'; // Ocultar botón de validar
    }
}

function validarRespuestaIncorrecta() {
    const respuestas = document.getElementsByName('respuestaIncorrecta');
    let respuestaSeleccionada = '';
    for (const respuesta of respuestas) {
        if (respuesta.checked) {
            respuestaSeleccionada = respuesta.value;
            break;
        }
    }

    if (respuestaSeleccionada) {
        const preguntaObj = preguntasIncorrectas[indicePreguntaIncorrecta];
        if (respuestaSeleccionada === preguntaObj.correcta) {
            alert('¡Correcto!');
            conteoIncorrectas[preguntaObj.pregunta]--; // Disminuir contador
            if (conteoIncorrectas[preguntaObj.pregunta] <= 0) {
                delete conteoIncorrectas[preguntaObj.pregunta]; // Eliminar si ya fue respondida correctamente
                preguntasIncorrectas.splice(indicePreguntaIncorrecta, 1); // Eliminar de la lista de incorrectas
                indicePreguntaIncorrecta--; // Ajustar el índice
            }
        } else {
            alert('Incorrecto. La respuesta correcta es: ' + preguntaObj.correcta);
        }
        indicePreguntaIncorrecta++;
        cargarPreguntasIncorrectas(); // Cargar la siguiente pregunta incorrecta
    } else {
        alert('Por favor, selecciona una respuesta.');
    }
}

// Asignar eventos a los botones
document.getElementById('siguiente').onclick = () => {
    evaluarRespuestas(); // Evaluar respuestas antes de pasar a las siguientes
};
document.getElementById('validar').onclick = validarRespuestaIncorrecta;

// Inicializar la visualización de preguntas al cargar la página
mostrarPreguntas();
cargarPreguntasIncorrectas();
