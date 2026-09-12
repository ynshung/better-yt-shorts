import { tryToggleFullscreen } from "./HandleFullscreen";
import { goToNextShort, goToPreviousShort, restartShort } from "./VideoState";
import { VOLUME_INCREMENT_AMOUNT } from "./declarations";
import {
  BooleanDictionary,
  StateObject,
  PolyDictionary,
  StringDictionary,
} from "./definitions";
import { getCaptionsButton, getVideo } from "./getters";
import { getVolume, setVolume } from "./Volume";

export function handleKeyEvent(
  e: KeyboardEvent,
  features: BooleanDictionary,
  keybinds: StringDictionary,
  settings: PolyDictionary,
  options: PolyDictionary,
  state: StateObject,
) {
  if (
    [...document.querySelectorAll("input")].includes(
      document.activeElement as HTMLInputElement,
    ) ||
    [...document.querySelectorAll("#contenteditable-root")].includes(
      document.activeElement as HTMLElement,
    )
  )
    return; // Avoids using keys while the user interacts with any input, like search and comment.

  if (features !== null && !features["keybinds"]) return;

  const ytShorts = getVideo();
  if (!ytShorts) return;

  const key = e.code;
  const keyAlt = e.key.toLowerCase(); // for legacy keybinds

  let command;
  for (const [cmd, keybind] of Object.entries(keybinds as object))
    if (key === keybind || keyAlt === keybind) command = cmd;

  if (!command) return;

  switch (command) {
    case "seekBackward":
      ytShorts.currentTime -= options.seekAmount as number;
      break;

    case "seekForward":
      ytShorts.currentTime += options.seekAmount as number;
      break;

    case "decreaseSpeed":
      if (ytShorts.playbackRate > 0.25) ytShorts.playbackRate -= 0.25;
      break;

    case "resetSpeed":
      ytShorts.playbackRate = 1;
      break;

    case "increaseSpeed":
      if (ytShorts.playbackRate < 16) ytShorts.playbackRate += 0.25;
      break;

    case "increaseVolume": {
      const current = getVolume() ?? ytShorts.volume * 100;
      setVolume(current + VOLUME_INCREMENT_AMOUNT * 100);
      break;
    }

    case "decreaseVolume": {
      const current = getVolume() ?? ytShorts.volume * 100;
      setVolume(current - VOLUME_INCREMENT_AMOUNT * 100);
      break;
    }

    case "toggleCaptions": {
      getCaptionsButton()?.click();
      break;
    }

    case "toggleFullScreen": {
      tryToggleFullscreen();
      break;
    }

    case "previousFrame":
      if (ytShorts.paused) {
        ytShorts.currentTime -= 0.04;
      }
      break;

    case "nextFrame":
      if (ytShorts.paused) {
        ytShorts.currentTime += 0.04;
      }
      break;

    case "nextShort":
      goToNextShort();
      break;

    case "previousShort":
      goToPreviousShort();
      break;

    case "restartShort":
      restartShort();
      break;
  }

  state.playbackRate = ytShorts.playbackRate;
}
