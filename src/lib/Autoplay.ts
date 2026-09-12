import local from "../background/i18n";
import { saveSettingsToStorage } from "./SaveToStorage";
import { skipShort } from "./VideoState";
import { StateObject, PolyDictionary } from "./definitions";
import { getActionElement, getCurrentId } from "./getters";
import { render } from "./utils";

export function handleAutoplay(
  state: StateObject,
  settings: PolyDictionary,
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

export function createAutoplaySwitch(
  settings: PolyDictionary,
  enabled: boolean,
) {
  if (!enabled) return;

  const actionElement = getActionElement();

  // Autoplay Switch
  const autoplaySwitch = render(`
    <div class="ytwReelActionBarViewModelHostDesktopActionButton">
      <label class="autoplay-switch">
        <input type="checkbox" id="autoplay-checkbox${getCurrentId()}" ${
          settings.autoplay ? "checked" : ""
        }/>
        <span class="autoplay-slider ytSpecButtonShapeNextMono ytSpecButtonShapeNextTonal"></span>
      </label>
      <div class="ytSpecButtonShapeWithLabelLabel">
        <span
          role="text"
          class="betterYT-auto ytAttributedStringHost ytAttributedStringWhiteSpacePreWrap ytAttributedStringTextAlignmentCenter ytAttributedStringWordWrapping"
          style="color: "var(--yt-spec-text-primary)""
        > ${local("autoplay")} </span>
      </div>
    </div>
  `);

  actionElement.insertBefore(autoplaySwitch, actionElement.children[0]);

  document
    .getElementById(`autoplay-checkbox${getCurrentId()}`)
    ?.addEventListener("change", (e: Event) => {
      settings.autoplay = (e.target as HTMLInputElement).checked;

      saveSettingsToStorage(settings);
    });
}
