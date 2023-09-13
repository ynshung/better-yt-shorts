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

export function getTitle() {
  return document.querySelector(`[id="${getCurrentId()}"] h2.title`) as HTMLElement
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
  return document.querySelector("#navigation-button-down > ytd-button-renderer > yt-button-shape") as HTMLElement
}

export function getBackButton()
{
  return document.querySelector("#navigation-button-up > ytd-button-renderer > yt-button-shape") as HTMLElement
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
  return document.querySelector("#player-container > div > ytd-shorts-player-controls > yt-icon-button:nth-child(2)")
}

export function getCommentsButton()
{
  return (
    document.querySelector( `[ id="${getCurrentId()}" ] #comments-button .yt-spec-touch-feedback-shape__fill` )
  ) as HTMLElement
  
}

export function getComments() {
  // make sure this works
  // [id="0"] ytd-comment-thread-renderer #comment #body #main #comment-content #content #content-text .style-scope.yt-formatted-string
  return (
    [ ...document.querySelectorAll( `[ id="${getCurrentId()}" ] ytd-comment-thread-renderer #comment #body #main #comment-content #content #content-text span.style-scope.yt-formatted-string` ) ]
  )
}
  
export function isCommentsPanelOpen()
{
  // return true if the selector finds an open panel
  // if panel is unfound, then the short either hasnt loaded, or the panel is not open
  return document.querySelector( `[ id="${getCurrentId()}" ] #watch-while-engagement-panel  [ visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED" ]` ) ?? false
}