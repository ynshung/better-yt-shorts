import { createAutoplaySwitch } from "./Autoplay";
import { setPlaybackRate } from "./PlaybackRate";
import { CYCLABLE_PLAYBACK_RATES } from "./declarations";
import { StateObject, BooleanDictionary, PolyDictionary } from "./definitions";
import { getActionElement, getCurrentId, getTitle, getVideo } from "./getters";
import { wheel } from "./utils";

export function populateActionElement(
  state: StateObject,
  settings: PolyDictionary,
  features: BooleanDictionary,
) {
  // ! use proper types
  const id = getCurrentId();
  const actionElement = getActionElement();
  const ytShorts = getVideo();

  if (!actionElement) throw new Error("Action element not found");
  if (!ytShorts) throw new Error("Video not found");

  // adsu- idk how any of this works so im just going to leave it be
  const betterYTContainer = document.createElement("div");
  betterYTContainer.id = "betterYT-container";
  betterYTContainer.setAttribute(
    "class",
    "button-container style-scope ytd-reel-player-overlay-renderer",
  );

  const ytdButtonRenderer = document.createElement("div");
  ytdButtonRenderer.setAttribute(
    "class",
    "betterYT-renderer style-scope ytd-reel-player-overlay-renderer",
  );

  const ytButtonShape = document.createElement("div");
  ytButtonShape.setAttribute("class", "betterYT-button-shape");

  const ytLabel = document.createElement("label");
  ytLabel.setAttribute("class", "yt-spec-button-shape-with-label");

  const ytButton = document.createElement("button");
  ytButton.setAttribute(
    "class",
    "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button ",
  );
  // Playback Rate
  const para0 = document.createElement("p");
  para0.classList.add("betterYT");
  para0.id = `ytPlayback${id}`;

  ytButton.style.display = features["playbackRate"] === false ? "none" : ""; // need this to check injection, so wont fully disable

  // Video title links to the main YT watch page
  const videoId = document.location.pathname?.match(/\/shorts\/(.+)$/);
  if (videoId) {
    const ytTitle = getTitle();
    const ytTitleLink = document.createElement("a");
    ytTitleLink.href = `https://youtube.com/watch?v=${videoId[1]}`;
    ytTitleLink.style.color = "inherit";
    ytTitleLink.style.textDecoration = "none";
    ytTitle.parentNode?.insertBefore(ytTitleLink, ytTitle);
    ytTitleLink.appendChild(ytTitle);
  }

  // Timer
  const ytTimer = document.createElement("div");
  ytTimer.classList.add("yt-spec-button-shape-with-label__label");
  const span1 = document.createElement("span");
  span1.setAttribute(
    "class",
    "yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center yt-core-attributed-string--word-wrapping",
  );
  span1.id = `ytTimer${getCurrentId()}`;
  span1.setAttribute("role", "text");
  ytTimer.style.display = features["timer"] ? "" : "none !important"; // need this to check injection, so wont fully disable
  ytTimer.appendChild(span1);

  // Match YT's HTML structure
  ytButton.appendChild(para0);
  ytLabel.appendChild(ytButton);
  ytLabel.appendChild(ytTimer);
  ytButtonShape.appendChild(ytLabel);
  ytdButtonRenderer.appendChild(ytButtonShape);
  betterYTContainer.appendChild(ytdButtonRenderer);

  actionElement.insertBefore(betterYTContainer, actionElement.children[1]);

  createAutoplaySwitch(settings, features["autoplay"]);

  if (features["playbackRate"])
    ytShorts.playbackRate = state.playbackRate as number;

  setPlaybackRate(state);

  betterYTContainer.addEventListener("click", () => {
    const index = CYCLABLE_PLAYBACK_RATES.indexOf(ytShorts.playbackRate);

    // cycle through defined rates
    if (index !== -1) {
      const newIndex = (index + 1) % CYCLABLE_PLAYBACK_RATES.length;
      state.playbackRate = CYCLABLE_PLAYBACK_RATES[newIndex];
      return;
    }

    // note that state is a proxy, and will automatically update the video's settings
    state.playbackRate = 1;
  });

  if (features["timer"])
    wheel(
      ytButton,
      () => {
        // speedup
        const video = getVideo();
        if (video === null) return;

        if (video.playbackRate < 16) video.playbackRate += 0.25;
        state.playbackRate = video.playbackRate;
      },
      () => {
        // speeddown
        const video = getVideo();
        if (video === null) return;

        if (video.playbackRate > 0.25) video.playbackRate -= 0.25;
        state.playbackRate = video.playbackRate;
      },
    );

  wheel(
    ytTimer,
    () => {
      // forward
      const video = getVideo();
      if (video !== null) video.currentTime += 1;
    },
    () => {
      // backward
      const video = getVideo();
      if (video !== null) video.currentTime -= 1;
    },
  );
}
