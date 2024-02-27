import { isVideoPlaying } from "./VideoState";
import { BooleanDictionary } from "./definitions";
import {
  getCurrentId,
  getOverlayElement,
  getUploadDate,
  getViews,
} from "./getters";

export function setInfo(features: BooleanDictionary) {
  if (!isVideoPlaying()) throw new Error("Video not playing");

  const addInfo = () => {
    const info = [];
    if (features["viewCounter"]) {
      const views = getViews().replace(/(\r\n|\n|\r)/gm, "");
      if (views) info.push(views);
    }
    if (features["uploadDate"]) {
      const uploadDate = getUploadDate().replace(/(\r\n|\n|\r)/gm, "");
      if (uploadDate) info.push(uploadDate);
    }

    const overlayElement = getOverlayElement();
    const h5 = document.createElement("h5");
    h5.id = `ytViews${getCurrentId()}`;
    h5.innerText = info.join(" | ");
    overlayElement.querySelector("reel-player-header-renderer h2")?.prepend(h5);
    clearInterval(views_interval);
  };

  const views_interval = setInterval(addInfo, 100);
}
