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

export function getLikeCount(): number
{
  const likesElement = document.querySelector(
    `[id="${getCurrentId()}"] > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer #like-button`
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

export const getActionElement = () =>
  document.querySelector(
    `[id="${getCurrentId()}"]  > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer > #actions`
  ) as HTMLElement

export function getOverlayElement()
{
  return document.querySelector(
    `[id="${ getCurrentId() }"]  > div.overlay.style-scope.ytd-reel-video-renderer > ytd-reel-player-overlay-renderer > #overlay`
  ) as HTMLElement

}

export function getVolumeContainer()
{
  const id = getCurrentId()
  return document.querySelector(
   `[id="${id}"]  > #player-container > div.player-controls.style-scope.ytd-reel-video-renderer > ytd-shorts-player-controls.style-scope.ytd-reel-video-renderer`
  ) as HTMLElement
}

export function getNextButton()
{
  return document.querySelector(
    "#navigation-button-down > .style-scope.ytd-shorts > yt-button-shape > button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-xl.yt-spec-button-shape-next--icon-button"
  ) as HTMLElement
}

export function getBackButton()
{
  return document.querySelector(
    "body > ytd-app:nth-child(10) > div#content.style-scope.ytd-app:nth-child(7) > ytd-page-manager#page-manager.style-scope.ytd-app:nth-child(4) > ytd-shorts.style-scope.ytd-page-manager:nth-child(1) > div.navigation-container.style-scope.ytd-shorts:nth-child(4) > div#navigation-button-up.navigation-button.style-scope.ytd-shorts:nth-child(1) > ytd-button-renderer.style-scope.ytd-shorts > yt-button-shape:nth-child(1) > button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-xl.yt-spec-button-shape-next--icon-button > yt-touch-feedback-shape:nth-child(2) > div.yt-spec-touch-feedback-shape.yt-spec-touch-feedback-shape--touch-response > div.yt-spec-touch-feedback-shape__fill:nth-child(2)"
  ) as HTMLElement
}
    
export function getVideo(): HTMLVideoElement | null
{ 
  return document.querySelector( "#shorts-player>div>video" ) 
}

export function getPlaybackElement()
{
  const id = getCurrentId()
  return document.getElementById( `ytPlayback${id}` )
}

export function getVolumeSliderController()
{
  const id = getCurrentId()
  return document.getElementById(`volumeSliderController${id}`)
}

export function getProgressBarList()
{
  return getOverlayElement().children[3].children[0].children[0]
}

export function getMuteButton()
{
  return document.querySelector(
    `body > ytd-app:nth-child(10) > div#content.style-scope.ytd-app:nth-child(7) > ytd-page-manager#page-manager.style-scope.ytd-app:nth-child(4) > ytd-shorts.style-scope.ytd-page-manager:nth-child(1) > div#shorts-container.style-scope.ytd-shorts:nth-child(3) > div#shorts-inner-container.style-scope.ytd-shorts:nth-child(2) > ytd-reel-video-renderer#\\30 .reel-video-in-sequence.style-scope.ytd-shorts:nth-child(3) > div#player-container.player-container.style-scope.ytd-reel-video-renderer:nth-child(2) > div.player-controls.style-scope.ytd-reel-video-renderer:nth-child(2) > ytd-shorts-player-controls.style-scope.ytd-reel-video-renderer > yt-icon-button.style-scope.ytd-shorts-player-controls:nth-child(2) > button#button.style-scope.yt-icon-button:nth-child(1) > yt-icon.style-scope.ytd-shorts-player-controls > yt-icon-shape.style-scope.yt-icon > icon-shape.yt-spec-icon-shape > div`
  )
}

export function getCommentsButton()
{
  return (
    document.querySelector( `[ id="${getCurrentId()}" ] #comments-button .yt-spec-touch-feedback-shape__fill` )
  ) as HTMLElement
  
}