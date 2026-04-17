import { headerComponent } from "../components/header.component.js";
import { state } from "../state.js";

export function resultView() {
  const data = state.result || {};

  // Valores genéricos por si el backend tarda o envía nombres distintos
  const carrera = data.carrera || "Carrera en Evaluación";
  const explicacion = data.explicacion || "Hemos recogido tus datos y evaluado tu perfil cognitivo.";
  const fortalezas = data.fortalezas || ["Pensamiento analítico", "Resolución de problemas"];
  const areas = data.areas || ["Investigación", "Desarrollo estratégico"];
  const recomendacion = data.recomendacion || "Te recomendamos explorar a fondo estas áreas laborales.";

  return `
    <div class="result-layout" style="min-height: 100vh; display: flex; flex-direction: column; background: var(--color-bg);">
      ${headerComponent(false)}

      <section style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 16px;">
        <div style="width: 100%; max-width: 700px; background: var(--color-surface); border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; padding: 40px; margin: 16px auto;">
          
          <h3 style="font-size: 14px; font-weight: 700; color: var(--color-primary); letter-spacing: 1px; margin-bottom: 8px;">RESULTADO VOCACIONAL</h3>
          <h1 style="font-size: 32px; font-weight: 800; color: #111827; margin-bottom: 24px; line-height: 1.2;">
            ${carrera}
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 32px;">
            ${explicacion}
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px;">
            <div>
              <h4 style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 12px;">Principales Fortalezas</h4>
              <ul style="padding-left: 20px; color: #4b5563; line-height: 1.6;">
                ${fortalezas.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>

            <div>
              <h4 style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 12px;">Áreas de Interés</h4>
              <ul style="padding-left: 20px; color: #4b5563; line-height: 1.6;">
                ${areas.map(a => `<li>${a}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 32px;">
            <h4 style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 8px;">Recomendación</h4>
            <p style="color: #374151; line-height: 1.6; margin: 0;">${recomendacion}</p>
          </div>

          <div style="display: flex; justify-content: flex-end; padding-top: 24px; border-top: 1px solid #f3f4f6;">
            <!-- Renderizará tu landing vaciando el state automáticamente si lo agregas -->
            <button id="go-home-btn" class="btn btn--dark" style="min-height: 48px; border-radius: 10px;">
              Volver al Inicio
            </button>
          </div>
          
        </div>
      </section>
    </div>
  `;
}
