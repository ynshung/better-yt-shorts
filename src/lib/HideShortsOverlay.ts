import { saveOptionsToStorage } from "./SaveToStorage";
import { PolyDictionary } from "./definitions";
import { getOverlay } from "./getters";

export function handleHideShortsOverlay(options: PolyDictionary) {
  const overlay = getOverlay();
  if (overlay === null) return;

  if (options.hideShortsOverlay) overlay.classList.add("betterYT-hidden");
  else overlay.classList.remove("betterYT-hidden");
}

export function setHideShortsOverlay(
  newValue: boolean,
  options: PolyDictionary,
) {
  saveOptionsToStorage({ ...options, hideShortsOverlay: newValue });
}
