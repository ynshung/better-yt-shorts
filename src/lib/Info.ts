import { isVideoPlaying } from "./VideoState";
import { INJECTION_MARKER } from "./declarations";
import {
  getCurrentId,
  getInfoElement,
  getOverlayElement,
  getUploadDate,
  getViews,
} from "./getters";

export function setInfo() {
  if (!isVideoPlaying()) return; // throw new Error("Video not playing");

  const overlayElement = getOverlayElement();
  if (overlayElement === null) return;
  const h5 = document.createElement("h5");
  h5.id = `bys-ytViews${getCurrentId()}`;
  h5.setAttribute(INJECTION_MARKER, ""); // ? for injection checks
  overlayElement.querySelector("reel-player-header-renderer h2")?.prepend(h5);

  updateInfo();
}

export function updateInfo() {
  const element = getInfoElement();
  if (element === null) return;

  const info = [];

  const views = getViews().replace(/(\r\n|\n|\r)/gm, "");
  if (views) info.push(views);

  const uploadDate = getUploadDate().replace(/(\r\n|\n|\r)/gm, "");
  if (uploadDate) info.push(uploadDate);

  element.innerText = info.join(" | ");
}
