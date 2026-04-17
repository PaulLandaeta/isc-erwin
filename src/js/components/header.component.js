export function headerComponent(showButton = false) {
  return `
    <header class="site-header">
      <div class="container site-header__content">
        <button class="site-logo site-logo-button" id="go-home-btn" aria-label="Volver al inicio">
          <img src="/public/assets/images/UPB.png" alt="UPB" class="site-logo__image" />
        </button>

        ${
          showButton
            ? `
              <button id="header-start-btn" class="btn btn--primary btn--header">
                Comienza tu test
              </button>
            `
            : ``
        }
      </div>
    </header>
  `;
}