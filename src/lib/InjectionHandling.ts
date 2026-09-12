import { populateActionElement, syncButtonVariants } from "./ActionElement";
import { INJECTION_MARKER } from "./declarations";
import { BooleanDictionary, PolyDictionary, StateObject } from "./definitions";
import { getActionElement, getCurrentId } from "./getters";

export function injectItems(
  state: StateObject,
  settings: PolyDictionary,
  options: PolyDictionary,
  features: BooleanDictionary,
) {
  state.lastTime = -1;
  const id = getCurrentId();
  if (id === null) return;

  if (!checkForInjectionMarker(getActionElement()))
    populateActionElement(state, settings, features);
  else syncButtonVariants();
}

/**
 * Returns true if the element has an injection marker (this should mean the item was injected)
 * @param element The element that has the marker, generally on something with a getter function (like, say, getVideo())
 */
export function checkForInjectionMarker(element: Element | HTMLElement | null) {
  return element !== null && element.hasAttribute(INJECTION_MARKER);
}
