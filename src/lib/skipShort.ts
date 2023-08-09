// video with no likes    => https://www.youtube.com/shorts/ZFLRydDd9Mw
// video with no likes and 23k comments => https://www.youtube.com/shorts/gISsypl5xsc
// another                => https://www.youtube.com/shorts/qe56pgRVrgE?feature=share
// video with 1.5M / 1,5M => https://www.youtube.com/shorts/nKZIx1bHUbQ

import { getNextButton, getVideo } from "./getters"

export function shouldSkipShort( state: any, options: any, currentId: string, likeCount: number )
{
  // for debugging purposes

  // console.dir({
  //   "extra options check": !( extraOptions == null ),
  //   "video playing check": !( getVideo().currentTime === 0 ),
  //   "option enabled?": !( !extraOptions.skip_enabled ),
  //   "current id check": !( currentId < topId ),
  //   "skipped id check": !( skippedId === currentId ),
  //   "likecount null check": !( likeCount === null || isNaN( likeCount ) ),
  //   "threshold check": !( likeCount >= extraOptions.skip_threshold ),
  //   "current threshold": extraOptions.skip_threshold,
  //   "number of likes": likeCount
  // })

  if ( options === null )                          return false
  if ( getVideo()?.currentTime === 0 )             return false // video unstarted, likes likely not loaded

  if ( !options.skip_enabled )                     return false
  if ( currentId < state.topId )                   return false // allow user to scroll back up to see skipped video
  if ( state.skippedId === currentId )             return false // prevent skip spam
  if ( likeCount === null || isNaN( likeCount ) )  return false // dont skip unloaded shorts
  if ( likeCount >= options.skip_threshold )       return false

  return true
}

export function skipShort()
{
  getNextButton()?.click()
}
