import { headerComponent } from "../components/header.component.js";

export function registerView() {
  return `
    <div class="register-layout">
      ${headerComponent(false)}

      <section class="register-page">
        <div class="container register-page__content">
          <div class="register-card">
            <h1 class="register-card__title">Descubre tu carrera ideal</h1>
            <p class="register-card__description">
              Completa tus datos para comenzar tu test vocacional
            </p>

            <form id="register-form" class="register-form">
              <div class="form-group">
                <label for="nombre" class="form-label">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  class="form-input"
                  placeholder="Ej. Julio León Prado"
                />
                <p class="form-error" id="error-nombre"></p>
              </div>

              <div class="form-group">
                <label for="apoderado" class="form-label">Nombre de un apoderado</label>
                <input
                  type="text"
                  id="apoderado"
                  name="apoderado"
                  class="form-input"
                  placeholder="Ej. Julio León Prado"
                />
                <p class="form-error" id="error-apoderado"></p>
              </div>

              <div class="form-group">
                <label for="correo" class="form-label">Correo electronico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  class="form-input"
                  placeholder="Ej. upb@correo.com"
                />
                <p class="form-error" id="error-correo"></p>
              </div>

              <div class="form-group">
                <label for="whatsappApoderado" class="form-label">Numero de WhatsApp de un apoderado</label>
                <input
                  type="tel"
                  id="whatsappApoderado"
                  name="whatsappApoderado"
                  class="form-input"
                  placeholder="Ej. 00000000"
                />
                <p class="form-error" id="error-whatsappApoderado"></p>
              </div>

              <div class="form-group">
                <label for="whatsapp" class="form-label">Numero de WhatsApp</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  class="form-input"
                  placeholder="Ej. 00000000"
                />
                <p class="form-error" id="error-whatsapp"></p>
              </div>

              <div class="form-group">
                <label for="colegio" class="form-label">Nombre del colegio</label>
                <input
                  type="text"
                  id="colegio"
                  name="colegio"
                  class="form-input"
                  placeholder="Ej. Colegio Nacional"
                />
                <p class="form-error" id="error-colegio"></p>
              </div>

              <div class="form-group">
                <label for="carreraInteres" class="form-label">Carrera de interes</label>
                <input
                  type="text"
                  id="carreraInteres"
                  name="carreraInteres"
                  class="form-input"
                  placeholder="Ej. Derecho"
                />
                <p class="form-error" id="error-carreraInteres"></p>
              </div>

              <button type="submit" class="btn btn--dark register-form__submit">
                Siguiente →
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `;
}