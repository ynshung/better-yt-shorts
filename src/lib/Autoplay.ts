import local from "../background/i18n";
import { saveSettingsToStorage } from "./SaveToStorage";
import { skipShort } from "./VideoState";
import { StateObject } from "./definitions";
import { getActionElement, getCurrentId, getVideo } from "./getters";
import { render } from "./utils";

export function handleAutoplay(
  state: StateObject,
  settings: any,
  enabled: boolean,
) {
  if (!enabled) return;
  if (!settings.autoplay) return;

  // prevent autoplay spam
  const currentId = getCurrentId();
  if (currentId === null) return;
  if (state.skippedId === currentId) return;

  state.skippedId = currentId;
  skipShort();
}

export function handleEnableAutoplay() {
  const ytShorts = getVideo();
  if (ytShorts === null) return false;
}

export function createAutoplaySwitch(settings: any, enabled: boolean) {
  if (!enabled) return;

  const actionElement = getActionElement();

  // Autoplay Switch
  const autoplaySwitch = render(`
    <div>
      <label class="autoplay-switch">
        <input type="checkbox" id="autoplay-checkbox${getCurrentId()}" ${
          settings.autoplay ? "checked" : ""
        }/>
        <span class="autoplay-slider"></span>
      </label>
      <div class="yt-spec-button-shape-with-label__label">
        <span 
          role="text"
          class="betterYT-auto yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center"
        > ${local("autoplay")} </span>
      </div>
    </div>
  `);

  actionElement.insertBefore(autoplaySwitch, actionElement.children[1]);

  document
    .getElementById(`autoplay-checkbox${getCurrentId()}`)
    ?.addEventListener("change", (e: any) => {
      settings.autoplay = e.target.checked;

      saveSettingsToStorage(settings);
    });
}
