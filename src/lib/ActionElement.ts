import { createAutoplaySwitch } from "./Autoplay";
import { setPlaybackRate } from "./PlaybackRate";
import { CYCLABLE_PLAYBACK_RATES, INJECTION_MARKER } from "./declarations";
import { BooleanDictionary, PolyDictionary, StateObject } from "./definitions";
import { checkForInjectionMarker } from "./InjectionHandling";
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

  if (!actionElement) return; // throw new Error("Action element not found");
  if (!ytShorts) return; // throw new Error("Video not found");

  // Playback Rate
  const para0 = document.createElement("p");
  para0.classList.add("betterYT");
  para0.id = `ytPlayback${id}`;

  // Video title links to the main YT watch page
  const videoId = document.location.pathname?.match(/\/shorts\/(.+)$/);
  const ytTitle = videoId ? getTitle() : null;
  if (videoId && ytTitle) {
    const ytTitleLink = document.createElement("a");
    ytTitleLink.href = `https://youtube.com/watch?v=${videoId[1]}`;
    ytTitleLink.style.color = "inherit";
    ytTitleLink.style.textDecoration = "none";
    ytTitle.parentNode?.insertBefore(ytTitleLink, ytTitle);
    ytTitleLink.appendChild(ytTitle);
  }

  // Attempt to clone a native action-bar button so styling always matches YT's current look
  const nativeButton =
    actionElement.querySelector<HTMLElement>("button-view-model");

  let ytButton: HTMLElement;
  let ytTimer: HTMLElement;

  if (nativeButton) {
    ytButton = nativeButton.cloneNode(true) as HTMLElement;
    ytButton.removeAttribute("aria-label");
    ytButton.setAttribute("title", "Playback rate");
    ytButton.classList.add("ytwReelActionBarViewModelHostDesktopActionButton");

    ytButton
      .querySelectorAll("[aria-label]")
      .forEach((el) => el.setAttribute("aria-label", "Playback rate"));
    ytButton.querySelectorAll("svg, yt-icon").forEach((el) => el.remove());
    ytButton
      .querySelectorAll("yt-touch-feedback-shape, yt-light-shape")
      .forEach((el) => el.remove());

    // put the rate text where the icon was
    const iconContainer =
      ytButton.querySelector(
        ".ytSpecButtonShapeNextIcon, .yt-spec-button-shape-next__icon",
      ) ??
      ytButton.querySelector("button") ??
      ytButton;
    iconContainer.appendChild(para0);

    // reuse the label span as the timer, or create one if the clone has no label
    ytTimer =
      ytButton.querySelector<HTMLElement>(
        ".ytAttributedStringHost, [role='text'], .yt-core-attributed-string",
      ) ?? document.createElement("span");
    ytTimer.id = `ytTimer${id}`;
    ytTimer.setAttribute("role", "text");
    ytTimer.textContent = "";
    ytTimer.style.display = features["timer"] ? "" : "none"; // need this to check injection, so wont fully disable
    ytButton.style.display = features["playbackRate"] === false ? "none" : ""; // need this to check injection, so wont fully disable
    actionElement.insertBefore(ytButton, actionElement.children[0]); // place above native buttons
  } else {
    // Legacy fallback: hand-build the button to match YT's old HTML structure
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

    ytButton = document.createElement("button");
    ytButton.setAttribute(
      "class",
      "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button ",
    );

    ytButton.style.display = features["playbackRate"] === false ? "none" : ""; // need this to check injection, so wont fully disable

    ytTimer = document.createElement("div");
    ytTimer.classList.add("yt-spec-button-shape-with-label__label");
    const span1 = document.createElement("span");
    span1.setAttribute(
      "class",
      "yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center yt-core-attributed-string--word-wrapping",
    );
    span1.id = `ytTimer${id}`;
    span1.setAttribute("role", "text");
    ytTimer.appendChild(span1);

    // Match YT's HTML structure
    ytButton.appendChild(para0);
    ytLabel.appendChild(ytButton);
    ytLabel.appendChild(ytTimer);
    ytButtonShape.appendChild(ytLabel);
    ytdButtonRenderer.appendChild(ytButtonShape);
    betterYTContainer.appendChild(ytdButtonRenderer);

    actionElement.insertBefore(betterYTContainer, actionElement.children[0]);
  }

  createAutoplaySwitch(settings, features["autoplay"]);

  if (features["playbackRate"]) {
    ytShorts.playbackRate = state.playbackRate as number;
  }

  setPlaybackRate(state);

  ytButton.addEventListener("click", () => {
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

  actionElement.setAttribute(INJECTION_MARKER, ""); // ? set marker for injection checks, only after successful UI build
}

/**
 * Syncs our injected buttons' variant classes with the like button, so styling
 * follows YT's current layout context (Mono beside the bar, OverlayDark when
 * over the video). Runs continuously via main() since YT can re-render the
 * action bar with a different variant at any time (e.g. on scroll).
 */
export function syncButtonVariants() {
  const actionElement = getActionElement();
  if (!actionElement || !checkForInjectionMarker(actionElement)) return;

  const likeButton = actionElement.querySelector<HTMLElement>(
    "like-button-view-model button",
  );
  if (!likeButton) return;

  const likeLabel = likeButton.closest("label");
  const likeIsOverlay =
    likeLabel?.classList.contains("ytSpecButtonShapeWithLabelIsOverlay") ??
    false;

  // playback rate button
  const ourButton = [
    ...actionElement.querySelectorAll("button-view-model"),
  ].find((b) => b.querySelector("p"));
  if (ourButton) {
    const innerButton = ourButton.querySelector("button");
    if (innerButton) {
      [
        "ytSpecButtonShapeNextOverlayDark",
        "ytSpecButtonShapeNextOverlayLight",
        "ytSpecButtonShapeNextMono",
      ].forEach((cls) =>
        innerButton.classList.toggle(cls, likeButton.classList.contains(cls)),
      );
    }
    ourButton
      .querySelectorAll("label")
      .forEach((el) =>
        el.classList.toggle(
          "ytSpecButtonShapeWithLabelIsOverlay",
          likeIsOverlay,
        ),
      );
  }

  // autoplay switch text
  const autoplayText =
    actionElement.querySelector<HTMLElement>(".betterYT-auto");
  if (autoplayText) {
    const color = likeIsOverlay
      ? "rgb(255, 255, 255)"
      : "var(--yt-spec-text-primary)";
    if (autoplayText.style.color !== color) autoplayText.style.color = color;
  }
}
