import { state } from "./state.js";
import { validateRegisterForm } from "./services/validation.js";
import { getQuestions } from "./services/questions.service.js";

import { landingView } from "./views/landing.view.js";
import { registerView } from "./views/register.view.js";
import { testView } from "./views/test.view.js";
import { resultView } from "./views/result.view.js";
import { submitVocationalTest } from "./services/api.js";

const views = {
  landing: landingView,
  register: registerView,
  test: testView,
  result: resultView,
};

export function renderView(viewName) {
  const app = document.getElementById("app");

  if (!app) {
    console.error("No se encontró el contenedor #app");
    return;
  }

  const view = views[viewName];

  if (!view) {
    app.innerHTML = `<h1>Vista no encontrada: ${viewName}</h1>`;
    return;
  }

  state.currentView = viewName;
  app.innerHTML = view();

  bindGlobalEvents();
  bindViewEvents(viewName);
}

function bindGlobalEvents() {
  const goHomeBtn = document.getElementById("go-home-btn");

  if (goHomeBtn) {
    goHomeBtn.addEventListener("click", () => {
      renderView("landing");
    });
  }
}

function bindViewEvents(viewName) {
  if (viewName === "landing") {
    const headerBtn = document.getElementById("header-start-btn");
    const heroBtn = document.getElementById("hero-start-btn");

    if (headerBtn) {
      headerBtn.addEventListener("click", () => {
        renderView("register");
      });
    }

    if (heroBtn) {
      heroBtn.addEventListener("click", () => {
        renderView("register");
      });
    }
  }

  if (viewName === "register") {
    bindRegisterEvents();
  }

  if (viewName === "test") {
    bindTestEvents();
  }
}

function bindRegisterEvents() {
  const form = document.getElementById("register-form");
  const inputs = document.querySelectorAll(".form-input");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error");

      const errorText = document.getElementById(`error-${input.id}`);
      if (errorText) {
        errorText.textContent = "";
      }
    });
  });

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        nombre: document.getElementById("nombre")?.value?.trim() || "",
        apoderado: document.getElementById("apoderado")?.value?.trim() || "",
        correo: document.getElementById("correo")?.value?.trim() || "",
        whatsappApoderado:
          document.getElementById("whatsappApoderado")?.value?.trim() || "",
        whatsapp: document.getElementById("whatsapp")?.value?.trim() || "",
        colegio: document.getElementById("colegio")?.value?.trim() || "",
        carreraInteres:
          document.getElementById("carreraInteres")?.value?.trim() || "",
      };

      clearFormErrors();

      const validation = validateRegisterForm(formData);

      if (!validation.isValid) {
        showFormErrors(validation.errors);
        return;
      }

      state.user = { ...formData };
      state.currentQuestionIndex = 0;
      state.answers = [];

      try {
        if (!state.questions.length) {
          state.questions = await getQuestions();
        }

        renderView("test");
      } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las preguntas del test.");
      }
    });
  }
}

function bindTestEvents() {
  const optionButtons = document.querySelectorAll(".question-option");
  const nextBtn = document.getElementById("next-question-btn");
  const prevBtn = document.getElementById("prev-question-btn");

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const option = button.dataset.option || "";

      state.answers[state.currentQuestionIndex] = option;

      renderView("test");
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        renderView("test");
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", async () => {
      const selectedAnswer = state.answers[state.currentQuestionIndex];
      const errorText = document.getElementById("question-error");

      if (!selectedAnswer) {
        if (errorText) {
          errorText.textContent = "Selecciona una opción para continuar.";
        }
        return;
      }

      const isLastQuestion =
        state.currentQuestionIndex === state.questions.length - 1;

      if (isLastQuestion) {
        nextBtn.disabled = true;
        nextBtn.textContent = "Analizando tu perfil...";

        try {
          const payload = {
            ...state.user,
            respuestas: buildAnswersPayload()
          };

          const resultData = await submitVocationalTest(payload);
          
          state.result = resultData;
          renderView("result");
        } catch (error) {
          console.error(error);
          alert("Hubo un error al procesar el test. Por favor intenta de nuevo.");
          nextBtn.disabled = false;
          nextBtn.textContent = "Finalizar";
        }
        return;
      }

      state.currentQuestionIndex += 1;
      renderView("test");
    });
  }
}

function buildAnswersPayload() {
  return state.questions.map((question, index) => ({
    preguntaId: question.id,
    pregunta: question.text,
    respuesta: state.answers[index] || "",
  }));
}

function showFormErrors(errors) {
  Object.keys(errors).forEach((field) => {
    const input = document.getElementById(field);
    const errorText = document.getElementById(`error-${field}`);

    if (input) {
      input.classList.add("error");
    }

    if (errorText) {
      errorText.textContent = errors[field];
    }
  });
}

function clearFormErrors() {
  const inputs = document.querySelectorAll(".form-input");
  const errors = document.querySelectorAll(".form-error");

  inputs.forEach((input) => input.classList.remove("error"));
  errors.forEach((err) => (err.textContent = ""));
}