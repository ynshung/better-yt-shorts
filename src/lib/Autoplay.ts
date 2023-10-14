import local from "../background/i18n";
import { saveSettingsToStorage } from "./SaveToStorage";
import { skipShort } from "./VideoState";
import { getActionElement, getCurrentId } from "./getters";
import { render } from "./utils";

export function handleAutoplay(settings: any, enabled: boolean) {
  if (!enabled) return;
  if (!settings.autoplay) return;
  skipShort();
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
