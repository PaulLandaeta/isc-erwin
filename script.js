// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // ==== NAVEGACIÓN Y ANIMACIONES GENERALES ====
    const btnIniciar = document.getElementById('btn-iniciar');
    if (btnIniciar) {
        btnIniciar.addEventListener('click', () => {
            window.location.href = 'test.html';
        });
    }
    const btnComienza = document.getElementById('btn-comienza')
    if (btnComienza) {
        btnComienza.addEventListener('click', () => {
            window.location.href = 'test.html';
        });
    }

    const btnContacto = document.getElementById('btn-contacto')
    if (btnContacto) {
        btnContacto.addEventListener('click', () => {
            window.location.href = 'https://wa.me/59177201229?text=Hola,%20quiero%20información%20sobre%20la%20carrera%20de:';
        });
    }
    // Animación suave de entrada en index
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateY(15px)';
        heroImage.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        setTimeout(() => { heroImage.style.opacity = '1'; heroImage.style.transform = 'translateY(0)'; }, 150);
    }
    const contentLeft = document.querySelector('.content-left');
    if (contentLeft) {
        contentLeft.style.opacity = '0';
        contentLeft.style.transform = 'translateY(10px)';
        contentLeft.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        setTimeout(() => { contentLeft.style.opacity = '1'; contentLeft.style.transform = 'translateY(0)'; }, 50);
    }


    // ==== FLUJO TEST VOCACIONAL (Formulario + Cuestionario) ====

    // ==== FUNCIONES REUTILIZABLES (BLOQUEO DE USUARIO) ====
    function yaRespondioTest() {
        return localStorage.getItem('test_vocacional_respondido') === 'true';
    }

    function marcarTestComoRespondido() {
        localStorage.setItem('test_vocacional_respondido', 'true');
    }

    function bloquearCuestionario() {
        const testMain = document.querySelector('.test-main');
        if (testMain) {
            testMain.innerHTML = `
            <div class="test-container blocked-message" style="text-align: center; padding: 40px; margin-top: 40px;">
                <h2>Cuestionario ya realizado</h2>
                <p>Solo se permite una respuesta por usuario.</p>
                <div style="margin-top: 20px;">
                    <a href="index.html" class="btn btn-blue" style="text-decoration: none;">Volver al inicio</a>
                </div>
            </div>`;
        }
    }

    const formTest = document.getElementById('form-test');

    // Si estamos en la vista del test y ya lo respondió, bloqueamos y detenemos ejecución
    if (formTest && yaRespondioTest()) {
        bloquearCuestionario();
        return;
    }

    // Variables de estado
    let userData = {};
    let currentQuestionIndex = 0;
    let quizAnswers = {};

    // Base de preguntas
    const defaultOptions = ["Mucho", "Mas o menos", "Poco"];
    const questions = [
        {
            id: 1,
            text: "Si tuvieras un sábado libre para aprender algo nuevo, ¿qué elegirías?",
            options: ["Un lenguaje de programación", "Una técnica de pintura", "Cómo funciona la economía"]
        },
        {
            id: 2,
            text: "¿Disfrutas analizar datos y buscar patrones?",
            options: defaultOptions
        },
        {
            id: 3,
            text: "¿Te atrae trabajar en tecnología y aprender nuevas herramientas digitales?",
            options: defaultOptions
        },
        {
            id: 4,
            text: "¿Prefieres trabajar con datos y números, con herramientas y objetos, o con personas e ideas?",
            options: ["Datos y números", "Herramientas y objetos", "Personas e ideas"]
        },
        {
            id: 5,
            text: "¿Te atrae manejar máquinas, herramientas o reparar objetos?",
            options: defaultOptions
        },
        {
            id: 6,
            text: "Ante un problema difícil, ¿qué haces?",
            options: ["Busco una solución lógica y probada", "Intento un enfoque nuevo y arriesgado"]
        },
        {
            id: 7,
            text: "¿Te interesan las ciencias naturales y experimentar en laboratorio?",
            options: defaultOptions
        },
        {
            id: 8,
            text: "Si pudieras salvar una institución, ¿cuál elegirías?",
            options: ["Un hospital", "Un museo de arte", "Una central tecnológica"]
        },
        {
            id: 9,
            text: "¿Qué te resulta más fácil?",
            options: ["Entender un manual de instrucciones", "Entender las emociones de una persona"]
        },
        {
            id: 10,
            text: "¿Te interesa el mundo de los negocios, ventas o emprendimiento?",
            options: defaultOptions
        }
    ];

    const totalQuestions = questions.length;

    // -- 1. Formulario inicial --
    if (formTest) {
        formTest.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre');
            const correo = document.getElementById('correo');
            const whatsapp = document.getElementById('whatsapp');

            let isValid = true;

            // Validación Nombre
            if (nombre.value.trim() === '') {
                nombre.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                nombre.parentElement.classList.remove('has-error');
            }

            // Validación Correo (formato básico)
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(correo.value.trim())) {
                correo.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                correo.parentElement.classList.remove('has-error');
            }

            // Validación WhatsApp
            if (whatsapp.value.trim().length < 8) {
                whatsapp.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                whatsapp.parentElement.classList.remove('has-error');
            }

            // Si es válido, avanza al test sin enviar nada a n8n todavía
            if (isValid) {
                userData = {
                    nombre: nombre.value.trim(),
                    correo: correo.value.trim(),
                    whatsapp: whatsapp.value.trim()
                };

                // Ocultar formulario, Mostrar Quiz
                document.getElementById('form-section').style.display = 'none';

                const quizSection = document.getElementById('quiz-section');
                quizSection.style.display = 'block';
                quizSection.style.animation = 'fadeIn 0.5s ease';

                loadQuestion(0);
            }
        });

        // Limpieza de error en tiempo real
        formTest.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('has-error');
            });
        });
    }

    // -- 2. Cuestionario Lógica --
    const btnNextQuestion = document.getElementById('btn-next-question');
    if (btnNextQuestion) {
        btnNextQuestion.addEventListener('click', handleNextQuestion);
    }

    function loadQuestion(index) {
        const question = questions[index];
        const percent = Math.round((index / totalQuestions) * 100);

        // UI Header Text
        document.getElementById('quiz-step').textContent = `PREGUNTA ${index + 1} DE ${totalQuestions}`;
        document.getElementById('quiz-percent').textContent = `${percent}% COMPLETADO`;
        document.getElementById('progress-bar').style.width = `${percent}%`;

        // Question Text
        document.getElementById('question-text').textContent = question.text;

        // Render Options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        document.getElementById('error-option').style.display = 'none';

        question.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'quiz-option';
            btn.textContent = opt;

            // Restablecer selección si el usuario regresara (aquí es lineal, pero buena práctica)
            if (quizAnswers[question.id] === opt) {
                btn.classList.add('selected');
            }

            btn.addEventListener('click', () => {
                // Quitar selected de todas y agregar a la actural
                Array.from(optionsContainer.children).forEach(child => child.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('error-option').style.display = 'none'; // ocultar error si había

                // Guardar respuesta
                quizAnswers[question.id] = opt;
            });

            optionsContainer.appendChild(btn);
        });

        // Botón acción dependiendo de la pregunta
        const btnText = document.getElementById('btn-quiz-text');
        if (index === totalQuestions - 1) {
            btnText.textContent = 'Enviar';
        } else {
            btnText.textContent = 'Siguiente';
        }
    }

    function handleNextQuestion() {
        const questionId = questions[currentQuestionIndex].id;

        // Validar que eligió una respuesta
        if (!quizAnswers[questionId]) {
            document.getElementById('error-option').style.display = 'block';
            return;
        }

        // Avanzar o enviar a n8n
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            sendFinalDataToN8N();
        }
    }

    async function sendFinalDataToN8N() {
        // Combinar datos según formato estricto solicitado
        const payload = {
            nombre: userData.nombre,
            correo: userData.correo,
            whatsapp: userData.whatsapp
        };

        // Agregar preguntas y sus respuestas
        questions.forEach(q => {
            payload[`pregunta${q.id}`] = q.text;
            payload[`respuesta${q.id}`] = quizAnswers[q.id];
        });

        // Cambiar apariencia botón a Loading
        const btnNext = document.getElementById('btn-next-question');
        const btnText = document.getElementById('btn-quiz-text');
        const btnLoader = document.getElementById('btn-quiz-loader');
        const btnIcon = document.getElementById('btn-quiz-icon');
        const statusMessage = document.getElementById('status-message');

        btnNext.disabled = true;
        btnNext.style.opacity = '0.8';
        btnNext.style.cursor = 'not-allowed';
        btnText.textContent = 'IA procesando';
        btnIcon.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        statusMessage.style.display = 'none';
        statusMessage.className = 'status-msg';

        // Intervalo de mensajes para que el usuario no piense que se trabó
        let loadingState = 0;
        const loadingMessages = [
            "IA procesando...",
            "Analizando perfil...",
            "La IA está pensando...",
            "Generando resultados...",
            "Casi listo..."
        ];
        btnText.textContent = loadingMessages[0];
        const loadingInterval = setInterval(() => {
            loadingState = (loadingState + 1) % loadingMessages.length;
            btnText.textContent = loadingMessages[loadingState];
        }, 5000); // Cambia cada 5 segundos

        // Configurar Timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 segundos de timeout

        try {
            // Petición POST final
            const response = await fetch('https://hectorpers.app.n8n.cloud/webhook/38f91f9b-c8c9-451e-9fc5-5adca03a4716', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            if (!response.ok) throw new Error('Error en la red o servidor n8n');

            // Inspeccionamos si es JSON válido
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                throw new Error('N8n no devolvió JSON (posible página de error)');
            }

            const result = await response.json();

            clearInterval(loadingInterval);
            clearTimeout(timeoutId);

            // 1. Verificamos si n8n dice que ya estaba respondido
            if (result.alreadyAnswered) {
                alert("Este cuestionario ya fue respondido anteriormente");
                marcarTestComoRespondido();
                bloquearCuestionario();
                return;
            }

            // 2. Si es válido guardamos que respondió
            marcarTestComoRespondido();

            // Ocultar la sección del quiz por completo
            document.getElementById('quiz-section').style.display = 'none';

            // Actualizar la interfaz con los valores retornados por n8n
            document.getElementById('res-carrera').textContent = result.carrera || 'Carrera no definida';
            document.getElementById('res-explicacion').textContent = result.explicacion || '';

            // Armar lista de fortalezas
            const listaFortalezas = document.getElementById('res-fortalezas');
            listaFortalezas.innerHTML = '';
            if (result.fortalezas && Array.isArray(result.fortalezas)) {
                result.fortalezas.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    listaFortalezas.appendChild(li);
                });
            } else if (typeof result.fortalezas === 'string') {
                const li = document.createElement('li');
                li.textContent = result.fortalezas;
                listaFortalezas.appendChild(li);
            }

            // Armar lista de áreas
            const listaAreas = document.getElementById('res-areas');
            listaAreas.innerHTML = '';
            if (result.areas && Array.isArray(result.areas)) {
                result.areas.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    listaAreas.appendChild(li);
                });
            } else if (typeof result.areas === 'string') {
                const li = document.createElement('li');
                li.textContent = result.areas;
                listaAreas.appendChild(li);
            }

            document.getElementById('res-recomendacion').textContent = result.recomendacion || '';

            // Mostrar el contenedor de la Sección 3 (Resultados)
            const resultSection = document.getElementById('result-section');
            resultSection.style.display = 'block';
            resultSection.style.animation = 'fadeIn 0.5s ease';

        } catch (error) {
            clearInterval(loadingInterval);
            clearTimeout(timeoutId);
            console.error('Error enviando a n8n:', error);

            // Mostrar error
            let errorMsg = 'Ocurrió un error al enviar. Por favor, intenta de nuevo.';
            if (error.name === 'AbortError') {
                errorMsg = 'El servidor tardó demasiado en responder (Timeout).';
            }
            statusMessage.textContent = errorMsg;
            statusMessage.classList.add('status-error');
            statusMessage.style.display = 'block';

            // Restaurar botón para intentar de nuevo
            btnNext.disabled = false;
            btnNext.style.opacity = '1';
            btnNext.style.cursor = 'pointer';
            btnText.textContent = 'Enviar';
            btnLoader.style.display = 'none';
            btnIcon.style.display = 'inline-block';
        }
    }

});
