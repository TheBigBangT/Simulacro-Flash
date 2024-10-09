let preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
let indicePreguntaActual = 0;
let puntos = 0;
const tiempoLimite = 5 * 60 * 1000; // 5 minutos en milisegundos
let preguntasIncorrectas = []; // Almacena preguntas incorrectas
let indicePreguntaIncorrecta = 0;

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

    iniciarTemporizador();
}

function iniciarTemporizador() {
    setTimeout(() => {
        // Si el tiempo se agota, asignar puntaje 0 a las preguntas no respondidas
        alert("Tiempo agotado para responder. Las preguntas no respondidas tienen puntaje 0.");
        mostrarPreguntas();
    }, tiempoLimite);
}

function siguientePreguntas() {
    mostrarPreguntas(); // Solo muestra la siguiente ronda de preguntas
}

document.getElementById('siguiente').onclick = siguientePreguntas;

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
        } else {
            alert('Incorrecto. La respuesta correcta es: ' + preguntaObj.correcta);
        }
        indicePreguntaIncorrecta++;
        cargarPreguntasIncorrectas(); // Cargar la siguiente pregunta incorrecta
    } else {
        alert('Por favor, selecciona una respuesta.');
    }
}

// Asignar eventos al botón de validar
document.getElementById('validar').onclick = validarRespuestaIncorrecta;

// Inicializar la visualización de preguntas al cargar la página
mostrarPreguntas();
cargarPreguntasIncorrectas();
