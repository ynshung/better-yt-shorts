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

export function injectItems(
  state: StateObject,
  settings: PolyDictionary,
  options: PolyDictionary,
  features: BooleanDictionary,
) {
  state.lastTime = -1;
  const id = getCurrentId();
  if (id === null) return;

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
  options: PolyDictionary,
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
        options["showVolumeHorizontally"] as boolean,
        features["volumeSlider"],
      );
    }),
  );
}

export function injectInfoElement(
  state: StateObject,
  features: BooleanDictionary,
) {
  const id = getCurrentId();
  if (id === null) return;

  const injectionState = findInjectionStateInSet(
    id,
    state.injectedItems as Set<InjectionState>,
  );

  if (injectionState === null) return;

  injectionState.addUnit(
    new InjectionStateUnit(InjectionItemsEnum.INFO, () => {
      setInfo(features);
    }),
  );
}
