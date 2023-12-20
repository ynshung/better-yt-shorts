import { isVideoPlaying } from "./VideoState";
import { BooleanDictionary } from "./definitions";
import { getCurrentId, getOverlayElement, getUploadDate } from "./getters";

export function setInfo(features: BooleanDictionary) {
  if (!isVideoPlaying()) throw new Error("Video not playing");

  const addInfo = () => {
    const info = [];
    if (features["uploadDate"]) {
      const uploadDate = getUploadDate().replace(/(\r\n|\n|\r)/gm, "");
      if (uploadDate) info.push(uploadDate);
    }

    const overlayElement = getOverlayElement();
    const h3 = document.createElement("h3");
    h3.id = `ytViews${getCurrentId()}`;
    h3.innerText = info.join(" | ");
    overlayElement
      .querySelector("ytd-reel-player-header-renderer a")
      ?.prepend(h3);
    clearInterval(views_interval);
  };

  const views_interval = setInterval(addInfo, 10);
}
