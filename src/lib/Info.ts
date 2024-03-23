import { isVideoPlaying } from "./VideoState";
import { INJECTION_MARKER } from "./declarations";
import { BooleanDictionary } from "./definitions";
import {
  getCurrentId,
  getInfoElement,
  getOverlayElement,
  getUploadDate,
  getViews,
} from "./getters";

export function setInfo(features: BooleanDictionary) {
  if (!isVideoPlaying()) return; // throw new Error("Video not playing");

  const overlayElement = getOverlayElement();
  const h5 = document.createElement("h5");
  h5.id = `bys-ytViews${getCurrentId()}`;
  h5.setAttribute(INJECTION_MARKER, ""); // ? for injection checks
  overlayElement.querySelector("reel-player-header-renderer h2")?.prepend(h5);

  updateInfo(features);
}

export function updateInfo(features: BooleanDictionary) {
  const element = getInfoElement();
  if (element === null) return;

  const info = [];

  if (features["viewCounter"]) {
    const views = getViews().replace(/(\r\n|\n|\r)/gm, "");
    if (views) info.push(views);
  }
  if (features["uploadDate"]) {
    const uploadDate = getUploadDate().replace(/(\r\n|\n|\r)/gm, "");
    if (uploadDate) info.push(uploadDate);
  }

  element.innerText = info.join(" | ");
}
