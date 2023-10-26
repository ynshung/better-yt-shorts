import { pingChanges } from "./chromeEmitters";
import { storage } from "./declarations";
import {
  ChangedObjectStateEnum,
  PolyDictionary,
  StringDictionary,
} from "./definitions";

export function saveSettingsToStorage(settings: PolyDictionary) {
  storage.set({ settings: settings });
  localStorage.setItem("yt-settings", JSON.stringify(settings));

  pingChanges(ChangedObjectStateEnum.SETTINGS, settings);
}

export function saveKeybindsToStorage(keybinds: StringDictionary) {
  storage.set({ keybinds: keybinds });
  localStorage.setItem("yt-keybinds", JSON.stringify(keybinds));

  pingChanges(ChangedObjectStateEnum.KEYBINDS, keybinds);
}

export function saveOptionsToStorage(options: PolyDictionary) {
  storage.set({ extraopts: options });
  localStorage.setItem("yt-extraopts", JSON.stringify(options));

  pingChanges(ChangedObjectStateEnum.OPTIONS, options);
}

export function saveFeaturesToStorage(features: PolyDictionary) {
  storage.set({ features: features });
  localStorage.setItem("yt-features", JSON.stringify(features));

  pingChanges(ChangedObjectStateEnum.FEATURES, features);
}
