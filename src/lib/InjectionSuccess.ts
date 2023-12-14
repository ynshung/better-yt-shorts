import { populateActionElement } from "./ActionElement";
import { setPlaybackRate, setTimer } from "./PlaybackRate";
import { modifyProgressBar } from "./ProgressBar";
import { setInfo } from "./Info";
import { setVolumeSlider } from "./VolumeSlider";
import { BooleanDictionary, PolyDictionary, StateObject } from "./definitions";
import { getCurrentId, getVideo } from "./getters";
import { injectEventsToExistingElements } from "./Events";

export function registerInjection(state: StateObject) {
  const id = getCurrentId();
  if (id !== null) (state.injectedItems as Set<number>).add(id);
}

export function injectItems(
  state: StateObject,
  settings: PolyDictionary,
  options: PolyDictionary,
  features: BooleanDictionary,
) {
  state.lastTime = -1;

  injectEventsToExistingElements();
  populateActionElement(state, settings, features);
  modifyProgressBar(features["progressBar"]);
  setVolumeSlider(
    state,
    settings,
    options["showVolumeHorizontally"] as boolean,
    features["volumeSlider"],
  );
  setInfo(features);

  registerInjection(state);
}

export function injectionWasRegistered(state: StateObject) {
  const id = getCurrentId();
  if (id === null) return false;
  return (state.injectedItems as Set<number>).has(id);
}

export function checkForInjectionSuccess(
  state: StateObject,
  features: BooleanDictionary,
) {
  // If failed, retry injection during next interval
  if (!setTimer(state, features["timer"])) {
    const id = getCurrentId();
    if (id !== null) (state.injectedItems as Set<number>).delete(id);
  }

  state.lastTime = state.currTime;
}

export function handleInjectionChecks(
  state: StateObject,
  settings: PolyDictionary,
  options: PolyDictionary,
  features: BooleanDictionary,
) {
  const ytShorts = getVideo();
  if (ytShorts === null) return;

  state.currTime = Math.round(ytShorts.currentTime);

  if (!injectionWasRegistered(state))
    return injectItems(state, settings, options, features);

  if (state.currTime !== state.lastTime)
    checkForInjectionSuccess(state, features);

  setPlaybackRate(state);
}
