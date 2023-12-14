import { tryToggleFullscreen } from "./HandleFullscreen";
import { getVideo } from "./getters";

/**
 * Handle adding event listeners to existing elements.
 * For example, adds a double click event to the player to enter fullscreen mode
 */
export function injectEventsToExistingElements() {
  const player: HTMLElement | null = getVideo();

  // double click the player to enter fullscreen mode
  if (player !== null) player.addEventListener("dblclick", tryToggleFullscreen);
}
