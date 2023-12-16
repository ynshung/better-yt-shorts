import { populateActionElement } from "./ActionElement";
import { modifyProgressBar } from "./ProgressBar";
import { setInfo } from "./Info";
import { setVolumeSlider } from "./VolumeSlider";
import { BooleanDictionary, PolyDictionary, StateObject } from "./definitions";
import { getCurrentId } from "./getters";
import { injectEventsToExistingElements } from "./Events";
import {
  InjectionItemsEnum,
  InjectionState,
  InjectionStateUnit,
  findInjectionStateInSet,
} from "./InjectionState";
import { isVideoPlaying } from "./VideoState";

export function injectItems(
  state: StateObject,
  settings: PolyDictionary,
  options: PolyDictionary,
  features: BooleanDictionary,
) {
  state.lastTime = -1;
  const id = getCurrentId();
  if (id === null) return;
  if (!isVideoPlaying()) return;

  // eslint-disable-next-line prettier/prettier
  let injectionState = findInjectionStateInSet(id, state.injectedItems as Set<InjectionState>);
  let isNewState = false;

  if (injectionState === null) {
    // eslint-disable-next-line prettier/prettier
    injectionState = createNewInjectionState(id, state, settings, options, features);
    isNewState = true;
  }

  injectionState.injectRemainingItems();

  // eslint-disable-next-line prettier/prettier
  if (isNewState) {
    (state.injectedItems as Set<InjectionState>)?.add(injectionState);
  }
}

function createNewInjectionState(
  id: number,
  state: StateObject,
  settings: { [x: string]: string | number | boolean },
  options: any,
  features: BooleanDictionary,
) {
  // eslint-disable-next-line prettier/prettier
  return new InjectionState(
    id,
    new InjectionStateUnit(InjectionItemsEnum.ACTION_ELEMENT, () => {
      populateActionElement(state, settings, features);
    }),
    new InjectionStateUnit(InjectionItemsEnum.EXISTING_EVENTS, () => {
      injectEventsToExistingElements();
    }),
    new InjectionStateUnit(InjectionItemsEnum.PROGRESS_BAR, () => {
      modifyProgressBar(features["progressBar"]);
    }),
    new InjectionStateUnit(InjectionItemsEnum.VOLUME_SLIDER, () => {
      setVolumeSlider(
        state,
        settings,
        options["showVolumeHorizontally"],
        features["volumeSlider"],
      );
    }),
    new InjectionStateUnit(InjectionItemsEnum.INFO, () => {
      setInfo(features);
    }),
  );
}

export function handleInjectionChecks(
  state: StateObject,
  settings: PolyDictionary,
  options: PolyDictionary,
  features: BooleanDictionary,
) {
  injectItems(state, settings, options, features);
}
