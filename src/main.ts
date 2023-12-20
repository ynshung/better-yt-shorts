import { getCurrentId, getVideo } from "./lib/getters";
import { handleSkipShortsWithLowLikes } from "./lib/SkipShortsWithLowLikes";
import { injectInfoElement, injectItems } from "./lib/InjectionSuccess";
import { hasVideoEnded, isVideoPlaying } from "./lib/VideoState";
import { handleAutoplay, handleEnableAutoplay } from "./lib/Autoplay";
import { handleAutomaticallyOpenComments } from "./lib/AutomaticallyOpenComments";
import { handleProgressBarNotAppearing } from "./lib/ProgressBar";
import { handleHideShortsOverlay } from "./lib/HideShortsOverlay";
import { setTimer } from "./lib/PlaybackRate";
import { state, features, options, settings } from "./content";

export function main() {
  if (window.location.toString().indexOf("youtube.com/shorts/") < 0) return;

  const ytShorts = getVideo();
  const currentId = getCurrentId();

  if (ytShorts === null) return;
  if (currentId === null) return;

  if ((state.topId as number) < currentId) state.topId = currentId;

  // video has to have been playing to skip.
  // I'm undecided whether to use 0.5 or 1 for currentTime, as 1 isn't quite fast enough, but sometimes with 0.5, it skips a video above the minimum like count.
  if (isVideoPlaying()) {
    handleSkipShortsWithLowLikes(state, options);
    handleAutomaticallyOpenComments(state, options); // dev note: the implementation of this feature is a good starting point to figure out how to format your own
    injectInfoElement(state, features);
  }
  if (hasVideoEnded()) {
    handleAutoplay(state, settings, features["autoplay"]);
  }

  setTimer(state, features["timer"]);
  injectItems(state, settings, options, features);
  handleProgressBarNotAppearing();
  handleEnableAutoplay();
  handleHideShortsOverlay(options);
}
