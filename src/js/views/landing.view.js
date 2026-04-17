import { headerComponent } from "../components/header.component.js";

export function landingView() {
  return `
    <div class="landing-page">
      ${headerComponent(true)}

      <main class="hero-section">
        <div class="container hero-section__content">
          <div class="hero-copy">
            <p class="hero-copy__eyebrow">Proyecto carrera IA</p>
            <h2 class="hero-copy__brand">Vocacional.ia</h2>

            <h1 class="hero-copy__title">
              Descubre la
              <span class="hero-copy__title-accent">carrera ideal</span>
              para tu futuro.
            </h1>

            <p class="hero-copy__description">
              Un test vocacional inteligente diseñado para ayudarte a encontrar
              el camino profesional que mejor se adapta a tus habilidades y pasiones.
            </p>

            <div class="hero-copy__actions">
              <button id="hero-start-btn" class="btn btn--dark">
                Iniciar test vocacional →
              </button>

              <a
                href="https://wa.me/59177201229?text=Hola,%20quiero%20información%20sobre%20orientación%20vocacional"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn--success"
              >
                Contáctanos
              </a>
            </div>
          </div>

          <div class="hero-media">
            <div class="hero-media__image-wrapper">
              <img
                src="/public/assets/images/persona.jpeg"
                alt="Estudiante"
                class="hero-media__image"
              />
            </div>
          </div>
        </div>
      </main>

      <footer class="site-footer">
        <div class="container site-footer__content">
          <div class="site-footer__left">
            <img src="/public/assets/images/UPB.png" alt="UPB" class="footer-logo footer-logo--upb" />
          </div>

          <div class="site-footer__right">
            <img src="/public/assets/images/FIA.png" alt="FIA" class="footer-logo footer-logo--fia" />
          </div>
        </div>
      </footer>
    </div>
  `;
}