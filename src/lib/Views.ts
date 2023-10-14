import { isVideoPlaying } from "./VideoState";
import { getCurrentId, getOverlayElement, getViews } from "./getters";

export function setViews() {
    const views_interval = setInterval(addViewCount, 10);

    function addViewCount() {
        {
            if (!isVideoPlaying()) return;
            const overlayElement = getOverlayElement();
            const h3 = document.createElement("h3");
            h3.id = `ytViews${getCurrentId()}`;
            h3.innerText = getViews();
            overlayElement.querySelector("ytd-reel-player-header-renderer a")?.prepend(h3);
            clearInterval(views_interval);
        }
    }
}
