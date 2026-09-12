// todo  - cleanup, convert to named functions and add return types.

import { convertLocaleNumber } from "./utils";

export function getCurrentId() {
  const video: HTMLVideoElement | null = document.querySelector(
    "#shorts-player > div.html5-video-container > video",
  );
  if (video === null) return null;

  const closest: HTMLElement | null = video.closest(
    ".reel-video-in-sequence-new",
  );
  if (closest === null) return null;

  return +closest.id;
}

export function getLikeCount(): number | null {
  const likesElement: HTMLElement | null = document.querySelector(
    "like-button-view-model",
  );
  if (!likesElement) return null;

  const numberOfLikes = likesElement.textContent;

  // Convert the number of likes to the appropriate format
  return convertLocaleNumber(numberOfLikes);
}

export const getActionElement = () =>
  document.querySelector("reel-action-bar-view-model") as HTMLElement;

export function getNextButton() {
  return document.querySelector(
    "#navigation-button-down > ytd-button-renderer > yt-button-shape",
  ) as HTMLElement;
}

export function getBackButton() {
  return document.querySelector(
    "#navigation-button-up > ytd-button-renderer > yt-button-shape",
  ) as HTMLElement;
}

export function getVideo(): HTMLVideoElement | null {
  return document.querySelector("#shorts-player>div>video");
}

export function getCaptionsButton(): HTMLButtonElement | null {
  return document.querySelector("ytm-closed-captioning-button > button");
}

export function getPlaybackElement() {
  const id = getCurrentId();
  return document.getElementById(`ytPlayback${id}`);
}
