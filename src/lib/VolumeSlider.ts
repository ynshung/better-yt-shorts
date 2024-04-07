import { saveSettingsToStorage } from "./SaveToStorage";
import { INJECTION_MARKER, VOLUME_INCREMENT_AMOUNT } from "./declarations";
import { PolyDictionary, StateObject } from "./definitions";
import {
  getCurrentId,
  getVideo,
  getVolumeContainer,
  getVolumeSliderController,
} from "./getters";
import { render, wheel } from "./utils";

export function checkVolume(settings: PolyDictionary, sliderEnabled: boolean) {
  const ytShorts = getVideo();

  if (ytShorts === null) return;
  if (!sliderEnabled) return;

  if (settings?.volume !== null) ytShorts.volume = settings.volume as number;
  else settings.volume = ytShorts.volume;
}

export function setVolume(
  settings: PolyDictionary,
  newVolume: number,
  enabled: boolean,
) {
  newVolume = newVolume > 1 ? 1 : newVolume;
  newVolume = newVolume < 0 ? 0 : newVolume;

  settings.volume = newVolume;

  const volumeSliderController =
    getVolumeSliderController() as HTMLInputElement;
  if (volumeSliderController === null) return;

  const ytShorts = getVideo();
  volumeSliderController.value = "" + settings.volume;

  if (ytShorts === null) return;

  checkVolume(settings, enabled);

  saveSettingsToStorage(settings);
}

export function updateVolumeOrientation(showHorizontally: boolean) {
  const slider = getVolumeSliderController();
  if (slider === null) return;

  slider.classList.remove(showHorizontally ? "vertical" : "horizontal");
  slider.classList.add(showHorizontally ? "horizontal" : "vertical");

  slider.setAttribute("orient", showHorizontally ? "horizontal" : "vertical");
}

export function setVolumeSlider(
  state: StateObject,
  settings: PolyDictionary,
  showHorizontally: boolean,
  enabled: boolean,
) {
  if (!enabled) return;

  const id = getCurrentId();
  if (id === null) return; // throw new Error("ID not found");

  const volumeContainer = getVolumeContainer();
  if (!volumeContainer) return;
  volumeContainer.setAttribute(INJECTION_MARKER, ""); // ? for injections
  // const slider = document.createElement("input")
  const slider = render(`
    <input
      id="volumeSliderController${id}"
      type="range"
      class="volume-slider betterYT-volume-slider ${
        showHorizontally ? "horizontal" : "vertical"
      }"
      min="0"
      max="1"
      step="0.01"
      orient="${showHorizontally ? "horizontal" : "vertical"}"
      value="${settings.volume}"
    />
  `);

  if (settings.volume === null) settings.volume = 0.5;

  volumeContainer.appendChild(slider);

  // Prevent video from pausing/playing on click
  slider.addEventListener("input", (e: Event) =>
    setVolume(settings, (e.target as HTMLInputElement).valueAsNumber, enabled),
  );
  slider.addEventListener("click", (e) => e.stopPropagation());

  wheel(
    slider as HTMLElement,
    () => {
      const video = getVideo();
      if (video !== null)
        setVolume(settings, video.volume + VOLUME_INCREMENT_AMOUNT, enabled);
    },
    () => {
      const video = getVideo();
      if (video !== null)
        setVolume(settings, video.volume - VOLUME_INCREMENT_AMOUNT, enabled);
    },
  );
}
