import { headerComponent } from "../components/header.component.js";
import { state } from "../state.js";

export function testView() {
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const totalQuestions = state.questions.length;
  const currentNumber = state.currentQuestionIndex + 1;
  const progress = totalQuestions
    ? Math.round((state.currentQuestionIndex / totalQuestions) * 100)
    : 0;

  if (!currentQuestion) {
    return `
      <div class="test-layout">
        ${headerComponent(false)}

        <section class="test-page">
          <div class="container test-page__content">
            <div class="test-card">
              <h1 class="test-card__title">No hay preguntas disponibles</h1>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  const selectedAnswer = state.answers[state.currentQuestionIndex] || "";

  return `
    <div class="test-layout">
      ${headerComponent(false)}

      <section class="test-page">
        <div class="container test-page__content">
          <div class="question-card">
            <div class="question-card__top">
              <span class="question-card__counter">PREGUNTA ${currentNumber} DE ${totalQuestions}</span>
              <span class="question-card__progress-label">${progress}% COMPLETADO</span>
            </div>

            <div class="question-card__progress">
              <div class="question-card__progress-bar" style="width: ${progress}%;"></div>
            </div>

            <h1 class="question-card__title">${currentQuestion.text}</h1>

            <div class="question-options">
              ${currentQuestion.options
                .map(
                  (option) => `
                    <button
                      type="button"
                      class="question-option ${selectedAnswer === option ? "question-option--selected" : ""}"
                      data-option="${option}"
                    >
                      ${option}
                    </button>
                  `
                )
                .join("")}
            </div>

            <p class="question-card__error" id="question-error"></p>

            <div class="question-card__actions">
              ${
                state.currentQuestionIndex > 0
                  ? `
                    <button id="prev-question-btn" type="button" class="btn btn--secondary-outline">
                      Anterior
                    </button>
                  `
                  : ""
              }

              <button id="next-question-btn" type="button" class="btn btn--dark">
                ${state.currentQuestionIndex === totalQuestions - 1 ? "Finalizar" : "Siguiente →"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}