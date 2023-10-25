import { populateActionElement } from "./ActionElement";
import { setPlaybackRate, setTimer } from "./PlaybackRate";
import { modifyProgressBar } from "./ProgressBar";
import { setInfo } from "./Info";
import { setVolumeSlider } from "./VolumeSlider";
import { BooleanDictionary, StateObject } from "./definitions";
import { getCurrentId, getVideo } from "./getters";

export function registerInjection(state: StateObject) {
  state.injectedItems.add(getCurrentId());
}

export function injectItems(state: StateObject, settings: any, features: any) {
  state.lastTime = -1;

  populateActionElement(state, settings, features);
  modifyProgressBar(features["progressBar"]);
  setVolumeSlider(state, settings, features["volumeSlider"]);
  setInfo(features);

  registerInjection(state);
}

export function injectionWasRegistered(state: StateObject) {
  return state.injectedItems.has(getCurrentId());
}

export function checkForInjectionSuccess(state: StateObject, features: any) {
  // If failed, retry injection during next interval
  if (!setTimer(state, features["timer"]))
    state.injectedItems.delete(getCurrentId());

  state.lastTime = state.currTime;
}

export function handleInjectionChecks(
  state: StateObject,
  settings: any,
  features: any,
) {
  const ytShorts = getVideo();
  if (ytShorts === null) return;

  state.currTime = Math.round(ytShorts.currentTime);

  if (!injectionWasRegistered(state))
    return injectItems(state, settings, features);

  if (state.currTime !== state.lastTime)
    checkForInjectionSuccess(state, features);

  setPlaybackRate(state);
}
