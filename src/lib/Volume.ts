const VOLUME_SLIDER_SELECTOR = "#volume-input";

/**
 * Reads the current volume (0-100) from YT's native volume slider UI.
 * Returns null if the slider is not present in the DOM.
 */
export function getVolume(): number | null {
  const slider = document.querySelector<HTMLInputElement>(
    VOLUME_SLIDER_SELECTOR,
  );
  if (!slider) return null;

  const value = Number(slider.value);
  return Number.isNaN(value) ? null : value;
}

/**
 * Sets the volume (0-100) through YT's native volume slider UI, so the
 * player's internal state, slider visuals and aria attributes stay in sync.
 * Falls back to writing directly on the video element if the slider is absent.
 */
export function setVolume(volume: number) {
  const clamped = Math.min(Math.max(volume, 0), 100);

  const slider = document.querySelector<HTMLInputElement>(
    VOLUME_SLIDER_SELECTOR,
  );

  if (!slider) {
    const video = document.querySelector<HTMLVideoElement>(
      "#shorts-player > div.html5-video-container > video",
    );
    if (video) video.volume = clamped / 100;
    return;
  }

  // use the native value setter so YT's listeners pick up the change
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;

  if (nativeSetter) nativeSetter.call(slider, String(clamped));
  else slider.value = String(clamped);

  slider.dispatchEvent(new Event("input", { bubbles: true }));
  slider.dispatchEvent(new Event("change", { bubbles: true }));
}
