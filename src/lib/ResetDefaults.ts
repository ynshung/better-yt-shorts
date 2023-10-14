import { pingChanges } from "./chromeEmitters";
import {
  DEFAULT_FEATURES,
  DEFAULT_KEYBINDS,
  DEFAULT_OPTIONS,
  storage,
} from "./declarations";
import { BooleanDictionary, ChangedObjectStateEnum } from "./definitions";

/**
 * Resets keybinds to their factory values in local and storage as well as the live binds
 */
export function resetKeybinds() {
  storage.set({ keybinds: DEFAULT_KEYBINDS });
  localStorage.setItem("yt-keybinds", JSON.stringify(DEFAULT_KEYBINDS));
  console.log("[BYS] :: Reset Keybinds to Defaults!");

  pingChanges(ChangedObjectStateEnum.KEYBINDS, DEFAULT_KEYBINDS);
}

/**
 * Resets options to their factory values in local and storage as well as the live binds
 */
export function resetOptions() {
  storage.set({ extraopts: DEFAULT_OPTIONS });
  localStorage.setItem("yt-extraopts", JSON.stringify(DEFAULT_OPTIONS));
  console.log("[BYS] :: Reset Options to Defaults!");

  pingChanges(ChangedObjectStateEnum.OPTIONS, DEFAULT_OPTIONS);
}

/**
 * Features are all set to true (this is essentially a regular reset)
 */
export function enableAllFeatures() {
  storage.set({ features: DEFAULT_FEATURES });
  localStorage.setItem("yt-features", JSON.stringify(DEFAULT_FEATURES));
  console.log("[BYS] :: Enabled all features!");

  pingChanges(ChangedObjectStateEnum.FEATURES, DEFAULT_FEATURES);

  return DEFAULT_FEATURES;
}
/**
 * Features are all set to false
 */
export function disableAllFeatures() {
  const newState = { ...DEFAULT_FEATURES } as BooleanDictionary;
  if (newState === null) return null;

  Object.entries(newState).map(([feature, value]) => {
    newState[feature] = false;
  });

  storage.set({ features: newState });
  localStorage.setItem("yt-features", JSON.stringify(newState));
  console.log("[BYS] :: Disabled all features!");

  pingChanges(ChangedObjectStateEnum.FEATURES, newState);

  return newState;
}
