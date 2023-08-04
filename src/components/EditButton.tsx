import React from 'react'
import { setKeybind, storage } from '../lib/declarations'
import { StringDictionary } from '../lib/definitions'

const edit_button_svg = (<>
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px">
  <g id="pencil-svg" strokeWidth={0} />
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
  <g id="SVGRepo_iconCarrier">
    <path d="M21.707,5.565,18.435,2.293a1,1,0,0,0-1.414,0L3.93,15.384a.991.991,0,0,0-.242.39l-1.636,4.91A1,1,0,0,0,3,22a.987.987,0,0,0,.316-.052l4.91-1.636a.991.991,0,0,0,.39-.242L21.707,6.979A1,1,0,0,0,21.707,5.565ZM7.369,18.489l-2.788.93.93-2.788,8.943-8.944,1.859,1.859ZM17.728,8.132l-1.86-1.86,1.86-1.858,1.858,1.858Z">
    </path>
  </g>
</svg>

</>)

interface Props {
  keybindsState: StringDictionary,
  setKeybindsState: any, // ! give specific type
  command: string,
}
export default function EditButton( { keybindsState, setKeybindsState, command }: Props ) {

  // todo  - add on click event + props

  function handleEditButtonClick( command: string ): void
  {
    console.log( `Clicked: ${command}` )

    // setKeybindState( () => {
    //   const newState = setKeybind( keybindState, command, key )

    //   storage.set( { "extraopts" : newState } )
    //   localStorage.setItem( "yt-extraopts", JSON.stringify( newState ) )
      
    //   console.log( `[BYS] :: Set keybind "${command}" to ${key}` )

    //   return newState
    // } )
  }

  return (
    <button id={command} className="edit-btn" onClick={ e => handleEditButtonClick( command ) }>
      {edit_button_svg}
    </button>
  )
}
