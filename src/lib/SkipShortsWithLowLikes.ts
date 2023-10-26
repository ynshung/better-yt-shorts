// video with no likes    => https://www.youtube.com/shorts/ZFLRydDd9Mw
// video with no likes and 23k comments => https://www.youtube.com/shorts/gISsypl5xsc
// another                => https://www.youtube.com/shorts/qe56pgRVrgE?feature=share
// video with 1.5M / 1,5M => https://www.youtube.com/shorts/nKZIx1bHUbQ

import { isVideoPlaying, skipShort } from "./VideoState";
import { PolyDictionary, StateObject } from "./definitions";
import { getCurrentId, getLikeCount } from "./getters";

export function shouldSkipShort(state: StateObject, options: PolyDictionary) {
  const currentId = getCurrentId();
  const likeCount = getLikeCount();

  if (currentId === null) return;

  // console.dir({
  //   "options are null": options === null,
  //   "is the video playing": isVideoPlaying(),
  //   "option isnt enabled": !options.skipEnabled,
  //   "current id below top id": currentId < state.topId,
  //   "current id is the skipped id": state.skippedId === currentId,
  //   "likecount is null or undefined": likeCount === null || isNaN( likeCount ),
  //   "likecount is above threshold": likeCount >= options.skipThreshold
  // })

  if (options === null) return false;
  if (!isVideoPlaying()) return false; // video unstarted, likes likely not loaded

  if (!options.skipEnabled) return false;
  if (state.topId === 0) return false; // dont skip first short ever
  if (currentId < (state.topId as number)) return false; // allow user to scroll back up to see skipped video
  if (state.skippedId === currentId) return false; // prevent skip spam
  if (likeCount === null || isNaN(likeCount)) return false; // dont skip unloaded shorts
  if (likeCount >= (options.skipThreshold as number)) return false;

  return true;
}
export function handleSkipShortsWithLowLikes(
  state: StateObject,
  options: PolyDictionary,
) {
  const likeCount = getLikeCount();

  if (shouldSkipShort(state, options)) {
    console.log("[BYS] :: Skipping short that had", likeCount, "likes");
    state.skippedId = getCurrentId();
    skipShort();
  }
}
