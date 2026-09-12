import { StateObject } from "./definitions";
import { getCurrentId, getPlaybackElement, getVideo } from "./getters";

export function setPlaybackRate(state: StateObject) {
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

  state.currTime = Math.floor(ytShorts.currentTime);

  const timerText = `${state.currTime}/${Math.round(ytShorts.duration)}s`;

  if (timerElement.innerText === timerText) return true;

  timerElement.innerText = timerText;

  return true;
}
