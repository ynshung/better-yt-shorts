import { getShortsContainer } from "./getters";

/**
 * Attempts to toggle fullscreen mode.
 * If in fullscreen, exits and vice versa.
 */
export function tryToggleFullscreen() {
  const shortsContainer = getShortsContainer();
  if (!shortsContainer) return;

  const isFullscreened = document.fullscreenElement === shortsContainer;

  if (isFullscreened) document.exitFullscreen();
  else shortsContainer.requestFullscreen();
}
