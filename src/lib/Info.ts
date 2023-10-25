import { isVideoPlaying } from "./VideoState";
import {
  getCurrentId,
  getOverlayElement,
  getUploadDate,
  getViews,
} from "./getters";

export function setInfo(features: any) {
  const views_interval = setInterval(addInfo, 10);

  function addInfo() {
    const info = [];
    if (features["viewCounter"]) {
      const views = getViews().replace(/(\r\n|\n|\r)/gm, "");
      if(views) info.push(views);
    }
    if (features["uploadDate"]) {
      const uploadDate = getUploadDate().replace(/(\r\n|\n|\r)/gm, "");
      if(uploadDate) info.push(uploadDate);
    }
    
    if (!isVideoPlaying()) return;
    const overlayElement = getOverlayElement();
    var h3 = document.createElement("h3");
    h3.id = `ytViews${getCurrentId()}`;
    h3.innerText = info.join(" | ");
    overlayElement
      .querySelector("ytd-reel-player-header-renderer a")
      ?.prepend(h3);
    clearInterval(views_interval);
  }
}
