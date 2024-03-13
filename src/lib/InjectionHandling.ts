import { populateActionElement } from "./ActionElement";
import { setInfo } from "./Info";
import { InjectionItemsEnum } from "./definitions";
import { modifyProgressBar } from "./ProgressBar";
import { setVolumeSlider } from "./VolumeSlider";
import { INJECTION_MARKER } from "./declarations";
import { BooleanDictionary, PolyDictionary, StateObject } from "./definitions";
import {
  getActionElement,
  getCurrentId,
  getInfoElement,
  getProgressBarList,
  getVolumeContainer,
} from "./getters";

export function injectItems(
  state: StateObject,
  settings: PolyDictionary,
  options: PolyDictionary,
  features: BooleanDictionary,
) {
  state.lastTime = -1;
  const id = getCurrentId();
  if (id === null) return;

  const items = Object.values(InjectionItemsEnum);

  items.map((item) =>
    injectIfNotPresent(item, state, settings, options, features),
  );
}

/**
 * Returns true if the element has an injection marker (this should mean the item was injected)
 * @param element The element that has the marker, generally on something with a getter function (like, say, getVideo())
 */
export function checkForInjectionMarker(element: Element | HTMLElement | null) {
  return element !== null && element.hasAttribute(INJECTION_MARKER);
}

/**
 * Switch case, checks if the given item was injected or not
 * @param item
 */
function injectIfNotPresent(
  item: string,
  state: StateObject,
  settings: PolyDictionary,
  options: PolyDictionary,
  features: BooleanDictionary,
) {
  switch (item) {
    case InjectionItemsEnum.ACTION_ELEMENT:
      if (!checkForInjectionMarker(getActionElement()))
        populateActionElement(state, settings, features);
      break;

    case InjectionItemsEnum.PROGRESS_BAR:
      if (!checkForInjectionMarker(getProgressBarList()))
        modifyProgressBar(features["progressBar"]);
      break;

    case InjectionItemsEnum.VOLUME_SLIDER:
      if (!checkForInjectionMarker(getVolumeContainer()))
        setVolumeSlider(
          state,
          settings,
          features["showVolumeHorizontally"],
          features["volumeSlider"],
        );
      break;

    case InjectionItemsEnum.INFO:
      if (!checkForInjectionMarker(getInfoElement())) setInfo(features);
      break;
  }
}
