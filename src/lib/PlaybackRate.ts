import { StateObject } from "./definitions";
import { getCurrentId, getPlaybackElement, getVideo } from "./getters";

export function setPlaybackRate(state: any) {
  const playBackElement = getPlaybackElement() as HTMLElement;

  if (playBackElement === null) return false;

  playBackElement.innerText = `${state.playbackRate}x`;

  return true;
}

export function setTimer(state: StateObject, timerEnabled: boolean) {
  const id = getCurrentId();
  const ytShorts = getVideo();
  if (ytShorts === null) return;

  if (document.getElementById(`ytTimer${id}`) === null) return false;

  const timerElement = document.getElementById(`ytTimer${id}`) as HTMLElement;

  if (!timerEnabled && timerElement) return true;

  timerElement.innerText = `${state.currTime}/${Math.round(
    ytShorts.duration,
  )}s`;

  return true;
}

// export function createPlaybackElement(state: StateObject, enabled: boolean) {
// enabled is handled differently here because this element is used to test injection
// style="display: ${enabled ? "block" : "none"};"
// }
