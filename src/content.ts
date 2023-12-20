import BROWSER from "./background/browser";
import { checkVolume, updateVolumeOrientation } from "./lib/VolumeSlider";
import { DEFAULT_STATE } from "./lib/declarations";
import {
  StateObject,
  BooleanDictionary,
  PolyDictionary,
  StringDictionary,
} from "./lib/definitions";
import { getCurrentId, getVideo } from "./lib/getters";
import { handleKeyEvent } from "./lib/handleKeyEvent";
import {
  retrieveFeaturesFromStorage,
  retrieveKeybindsFromStorage,
  retrieveOptionsFromStorage,
  retrieveSettingsFromStorage,
} from "./lib/retrieveFromStorage";
import { handleSkipShortsWithLowLikes } from "./lib/SkipShortsWithLowLikes";

// need this to ensure css is loaded in the dist
import "./css/content.css";
import { handleInjectionChecks } from "./lib/InjectionSuccess";
import { hasVideoEnded, isVideoPlaying } from "./lib/VideoState";
import { handleAutoplay, handleEnableAutoplay } from "./lib/Autoplay";
import { handleAutomaticallyOpenComments } from "./lib/AutomaticallyOpenComments";
import { handleProgressBarNotAppearing } from "./lib/ProgressBar";
import { handleHideShortsOverlay } from "./lib/HideShortsOverlay";

/**
 * content.ts
 *
 * Code in this file will be injected into the page itself.
 * For popup code, see  ./main.tsx
 */

const state = new Proxy(DEFAULT_STATE, {
  set(o: StateObject, prop: string, val: string | boolean | number | null) {
    o[prop] = val;

    const ytShorts = getVideo();

    // handle additional changes
    if (ytShorts !== null) {
      switch (prop) {
        case "playbackRate":
          ytShorts.playbackRate = val as number;
          break;
      }
    }

    return true;
  },
});

let keybinds: StringDictionary;
let options: PolyDictionary;
let settings: PolyDictionary;
let features: BooleanDictionary;

// todo  - add "settings" to localstorage (merge autoplay + player volume into one)
// localStorage.getItem("yt-player-volume") !== null && JSON.parse(localStorage.getItem("yt-player-volume"))["data"]["volume"]

retrieveKeybindsFromStorage((newBinds) => {
  keybinds = newBinds;
});
retrieveOptionsFromStorage((newOpts) => {
  options = newOpts;

  // set the default playback rate here
  if (typeof options["defaultPlaybackRate"] !== "number") return;
  state.playbackRate = options["defaultPlaybackRate"];
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

function main() {
  if (window.location.toString().indexOf("youtube.com/shorts/") < 0) return;

  const ytShorts = getVideo();
  const currentId = getCurrentId();

  if (ytShorts === null) return;
  if (currentId === null) return;

  if ((state.topId as number) < currentId) state.topId = currentId;

  // video has to have been playing to skip.
  // I'm undecided whether to use 0.5 or 1 for currentTime, as 1 isn't quite fast enough, but sometimes with 0.5, it skips a video above the minimum like count.
  if (isVideoPlaying()) {
    handleSkipShortsWithLowLikes(state, options);
    handleAutomaticallyOpenComments(state, options); // dev note: the implementation of this feature is a good starting point to figure out how to format your own
  }
  if (hasVideoEnded()) {
    handleAutoplay(state, settings, features["autoplay"]);
  }

  handleProgressBarNotAppearing();
  handleEnableAutoplay();
  handleInjectionChecks(state, settings, options, features);
  handleHideShortsOverlay(options);
}

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
