import { tryToggleFullscreen } from "./HandleFullscreen";
import { PolyDictionary } from "./definitions";
import { getVideo } from "./getters";

/**
 * Handle adding event listeners to existing elements.
 * For example, adds a double click event to the player to enter fullscreen mode
 *
 * Note that duplicate event listeners are ignored, so need need to check
 */
export function injectEvents(options: PolyDictionary) {
  const player: HTMLElement | null = getVideo();

  // double click the player to enter fullscreen mode
  if (player !== null && options["fullScreenDoubleClick"])
    player.addEventListener("dblclick", tryToggleFullscreen);
}
