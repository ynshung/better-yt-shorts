import { isVideoPlaying } from "./VideoState";
import {
  getCurrentId,
  getOverlayElement,
  getUploadDate,
  getViews,
} from "./getters";

export function setInfo() {
  const views_interval = setInterval(addInfo, 10);

  function addInfo() {
    const uploadDate = getUploadDate().replace(/(\r\n|\n|\r)/gm, "");
    const views = getViews().replace(/(\r\n|\n|\r)/gm, "");
    const info = views ? `${views} | ${uploadDate}` : uploadDate;
    if (!isVideoPlaying()) return;
    const overlayElement = getOverlayElement();
    var h3 = document.createElement("h3");
    h3.id = `ytViews${getCurrentId()}`;
    h3.innerText = info;
    overlayElement
      .querySelector("ytd-reel-player-header-renderer a")
      ?.prepend(h3);
    clearInterval(views_interval);
  }
}
