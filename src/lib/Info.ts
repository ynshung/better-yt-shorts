import { isVideoPlaying } from "./VideoState";
import { BooleanDictionary } from "./definitions";
import { getCurrentId, getOverlayElement, getUploadDate } from "./getters";

export function setInfo(features: BooleanDictionary) {
  const views_interval = setInterval(addInfo, 10);

  function addInfo() {
    const info = [];
    if (features["uploadDate"]) {
      const uploadDate = getUploadDate().replace(/(\r\n|\n|\r)/gm, "");
      if (uploadDate) info.push(uploadDate);
    }

    if (!isVideoPlaying()) return;
    const overlayElement = getOverlayElement();
    const h3 = document.createElement("h3");
    h3.id = `ytViews${getCurrentId()}`;
    h3.innerText = info.join(" | ");
    overlayElement
      .querySelector("ytd-reel-player-header-renderer a")
      ?.prepend(h3);
    clearInterval(views_interval);
  }
}
