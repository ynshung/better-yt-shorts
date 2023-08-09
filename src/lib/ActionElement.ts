import { setPlaybackRate } from "./PlaybackRate"
import { getActionElement, getCurrentId, getVideo } from "./getters"
import { render, wheel } from "./utils"

export function populateActionElement( state: any, settings: any ) // ! use proper types
{
  const id            = getCurrentId()
  const actionElement = getActionElement()
  const ytShorts      = getVideo()

  if ( !actionElement ) return
  if ( !ytShorts )      return

  const betterYTContainer = document.createElement("div")
  betterYTContainer.id = "betterYT-container"
  betterYTContainer.setAttribute("class", "button-container style-scope ytd-reel-player-overlay-renderer")

  const ytdButtonRenderer = document.createElement("div")
  ytdButtonRenderer.setAttribute("class", "betterYT-renderer style-scope ytd-reel-player-overlay-renderer")

  const ytButtonShape = document.createElement("div")
  ytButtonShape.setAttribute("class", "betterYT-button-shape")

  const ytLabel = document.createElement("label")
  ytLabel.setAttribute("class", "yt-spec-button-shape-with-label")

  const ytButton = document.createElement("button")      
  ytButton.setAttribute("class", "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button ")
  // Playback Rate
  var para0 = document.createElement("p")
  para0.classList.add("betterYT")
  para0.id = `ytPlayback${id}`


  // Timer
  const ytTimer = document.createElement("div")
  ytTimer.classList.add("yt-spec-button-shape-with-label__label")
  var span1 = document.createElement("span")
  span1.setAttribute("class", "yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center yt-core-attributed-string--word-wrapping")
  span1.id = `ytTimer${getCurrentId()}`
  span1.setAttribute("role", "text")
  ytTimer.appendChild(span1)



  // Match YT's HTML structure
  ytButton.appendChild(para0)
  ytLabel.appendChild(ytButton)
  ytLabel.appendChild(ytTimer)
  ytButtonShape.appendChild(ytLabel)
  ytdButtonRenderer.appendChild(ytButtonShape)
  betterYTContainer.appendChild(ytdButtonRenderer)


  actionElement.insertBefore(betterYTContainer, actionElement.children[1])

  // Autoplay Switch
  const autoplaySwitch = `
    <div class="yt-spec-button-shape-with-label__label">
      <label class="autoplay-switch">
        <input type="checkbox" id="autoplay-checkbox${ getCurrentId() }" ${ settings.autoplay ? "checked" : "" }/>
        <span class="autoplay-slider"></span>
      </label>

      <span 
        role="text"
        class=" yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center"
      > Autoplay </span>
    </div>
  `

  actionElement.insertBefore( render( autoplaySwitch ), actionElement.children[1] )

  // const autoplayTitle = `
  //   <div class="yt-spec-button-shape-with-label__label">
  //     <span 
  //       role="text"
  //       class="betterYT-auto yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--text-alignment-center"
  //     > Autoplay </span>
  //   </div>
  // `

  // actionElement.insertBefore( render( autoplayTitle ), actionElement.children[2] )


  ytShorts.playbackRate = state.playbackRate
  setPlaybackRate( state )
  // injectedSuccess = setTimer( currTime || 0, Math.round(ytShorts.duration || 0))

  betterYTContainer.addEventListener("click", () => {
    ytShorts.playbackRate = 1
    state.playbackRate = ytShorts.playbackRate
  })

  document.getElementById( `autoplay-checkbox${getCurrentId()}` )?.addEventListener('change', ( e: any ) => {
    if ( e.target.checked )
    {
      localStorage.setItem("yt-autoplay", "true")
      ytShorts.loop = false
    } 
    else 
    {
      localStorage.setItem("yt-autoplay", "false")
      ytShorts.loop = true
    }
  })

  
  wheel( 
    ytButton, 
    () => {
      // speedup
      const video = getVideo()
      if ( video === null ) return

      if (video.playbackRate < 16) video.playbackRate += 0.25
      state.playbackRate = video.playbackRate

    }, 
    () => {
      // speeddown
      const video = getVideo()
      if ( video === null ) return

      if (video.playbackRate > 0.25) video.playbackRate -= 0.25
      state.playbackRate = video.playbackRate
    }
  )
  
  wheel( 
    ytTimer, 
    () =>  { 
      // forward
      const video = getVideo()
      if ( video !== null ) video.currentTime += 1 
    },
    () => { 
      // backward
      const video = getVideo()
      if ( video !== null ) video.currentTime -= 1 
    }
  )
}