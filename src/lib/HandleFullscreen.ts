/**
 * Attempts to toggle fullscreen mode by clicking YT's own fullscreen button,
 * so the player's internal state (icon, aria, exit behavior) stays in sync.
 * Falls back to toggling directly on the shorts container if the button is absent.
 */
export function tryToggleFullscreen() {
  const fullscreenButton = document.querySelector<HTMLButtonElement>(
    "#fullscreen-button-shape > button",
  );

  if (fullscreenButton) {
    fullscreenButton.click();
    return;
  }

  const shortsContainer = document.getElementById("page-manager");
  if (!shortsContainer) return;

  const isFullscreened = document.fullscreenElement === shortsContainer;

  if (isFullscreened) document.exitFullscreen();
  else shortsContainer.requestFullscreen();
}
