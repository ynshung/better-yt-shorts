import BROWSER from "./background/browser";
import { checkVolume, updateVolumeOrientation } from "./lib/VolumeSlider";
import { DEFAULT_STATE } from "./lib/declarations";
import {
  StateObject,
  BooleanDictionary,
  PolyDictionary,
  StringDictionary,
} from "./lib/definitions";
import { getVideo } from "./lib/getters";
import { handleKeyEvent } from "./lib/handleKeyEvent";
import {
  retrieveFeaturesFromStorage,
  retrieveKeybindsFromStorage,
  retrieveOptionsFromStorage,
  retrieveSettingsFromStorage,
} from "./lib/retrieveFromStorage";

// need this to ensure css is loaded in the dist
import "./css/content.css";
import { setPlaybackRate } from "./lib/PlaybackRate";
import { main } from "./main";

/**
 * content.ts
 *
 * Code in this file will be injected into the page itself.
 * For popup code, see  ./main.tsx
 */

export const state = new Proxy(DEFAULT_STATE, {
  set(o: StateObject, prop: string, val: string | boolean | number | null) {
    o[prop] = val;

    const ytShorts = getVideo();

    // handle additional changes
    if (ytShorts !== null) {
      switch (prop) {
        case "playbackRate":
          ytShorts.playbackRate = val as number;
          setPlaybackRate(state);
          break;
      }
    }

    return true;
  },
});

let keybinds: StringDictionary;
export let options: PolyDictionary;
export let settings: PolyDictionary;
export let features: BooleanDictionary;

// todo  - add "settings" to localstorage (merge autoplay + player volume into one)
// localStorage.getItem("yt-player-volume") !== null && JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"]

retrieveKeybindsFromStorage((newBinds) => {
  keybinds = newBinds;
});
retrieveOptionsFromStorage((newOpts) => {
  options = newOpts;
});
retrieveSettingsFromStorage((newSettings) => {
  settings = newSettings;
});
retrieveFeaturesFromStorage((newFeatures) => {
  features = newFeatures;
});

// todo  - test this on firefox
BROWSER.runtime.onMessage.addListener((req) => {
  if (req?.keybinds) keybinds = req.keybinds;
  if (req?.options) options = req.options;
  if (req?.features) features = req.features;

  resetIntervals();
});

document.addEventListener("keydown", (e) =>
  handleKeyEvent(e, features, keybinds, settings, options, state),
);

let low_priority_interval = setInterval(lowPriorityCallback, 1000);
let main_interval = setInterval(main, 100);
let volume_interval = setInterval(volumeIntervalCallback, 10);

function volumeIntervalCallback() {
  if (window.location.toString().indexOf("youtube.com/shorts/") < 0) return;
  if (getVideo()) checkVolume(settings, features["volumeSlider"]);
}

function lowPriorityCallback() {
  updateVolumeOrientation(options["showVolumeHorizontally"] as boolean);
}

function resetIntervals() {
  clearInterval(volume_interval);
  volume_interval = setInterval(volumeIntervalCallback, 10);

  clearInterval(main_interval);
  main_interval = setInterval(main, 100);

  clearInterval(low_priority_interval);
  low_priority_interval = setInterval(lowPriorityCallback, 1000);
}
