// todo  - cleanup, convert to named functions and add return types.

import { convertLocaleNumber } from "./utils"

export function getCurrentId()
{
  const video = document.querySelector( "#shorts-player > div.html5-video-container > video" ) as HTMLVideoElement
  if ( video === null ) return null
  
  const closest = video.closest("ytd-reel-video-renderer" ) as HTMLElement
  if ( closest === null ) return null

  return +closest.id
}

export function getLikeCount( id: number | null ): number
{
  const likesElement = document.querySelector(
    `[id="${id}"] > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer #like-button`
  ) as HTMLElement

  // Use optional chaining and nullish coalescing to handle null values
  const numberOfLikes = (<HTMLElement>likesElement?.firstElementChild)?.innerText.split(/\r?\n/)[0]?.trim().replace(/\s/g, "").replace(/\.$/, "").toLowerCase() ?? "0"
  
  // Convert the number of likes to the appropriate format
  const likeCount = convertLocaleNumber( numberOfLikes ) as number
  
  // If likeCount is anything other than a number, it"ll return 0. Meaning it"ll translate every language.
  return !isNaN(likeCount) ? likeCount as number : 0
}

// Checking comment count aswell, as sometimes popular videos bug out and show 0 likes, but there"s 1000+ comments.
export const getCommentCount = ( id: number | null ) => {
  const commentsElement = document.querySelector(
    `[id="${id}"] > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer #comments-button`
  ) as HTMLElement

  // Use optional chaining and nullish coalescing to handle null values
  const numberOfComments = (<HTMLElement>commentsElement?.firstElementChild)?.innerText.split(/\r?\n/)[0]?.replace(/ /g, "") ?? "0"

  // Convert the number of comments to the appropriate format
  const commentCount = convertLocaleNumber(numberOfComments)

  // If commentCount is anything other than a number, it"ll return 0. Meaning it"ll handle every language.
  return !isNaN(commentCount as number) ? commentCount : 0
}

export const getActionElement = ( id: number | null ) =>
  document.querySelector(
    `[id="${id}"]  > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer > #actions`
  ) as HTMLElement

export const getOverlayElement = ( id: number | null ) =>
  document.querySelector(
    `[id="${id}"]  > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer > #overlay`
  ) as HTMLElement

export const getVolumeContainer = ( id: number | null ) =>
  document.querySelector(
    `[id="${id}"]  > #player-container > div.player-controls.style-scope.ytd-reel-video-renderer > ytd-shorts-player-controls.style-scope.ytd-reel-video-renderer`
  ) as HTMLElement

export const getNextButton = () =>
  document.querySelector(
    "#navigation-button-down > .style-scope.ytd-shorts > yt-button-shape > button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-xl.yt-spec-button-shape-next--icon-button"
  ) as HTMLElement

export function getVideo(): HTMLVideoElement | null
{ 
  return document.querySelector( "#shorts-player>div>video" ) 
}
