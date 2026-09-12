import { features, options, settings, state } from "./content";
import { handleAutoplay } from "./lib/Autoplay";
import { injectEvents } from "./lib/Events";
import { injectItems } from "./lib/InjectionHandling";
import { setTimer } from "./lib/PlaybackRate";
import { handleSkipShortsWithLowLikes } from "./lib/SkipShortsWithLowLikes";
import { hasVideoEnded, isVideoPlaying } from "./lib/VideoState";
import { getCurrentId, getVideo } from "./lib/getters";

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
  }
  if (hasVideoEnded()) {
    handleAutoplay(state, settings, features["autoplay"]);
  }

  setTimer(state, features["timer"]);
  injectItems(state, settings, options, features);
  injectEvents(options);
}
