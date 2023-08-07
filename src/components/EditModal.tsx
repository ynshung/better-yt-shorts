import { useEffect, useRef, useState } from 'react'
import Separator from './Separator'
import { DEFAULT_PRESSED_KEY, EXCLUDED_KEY_BINDS, storage } from '../lib/declarations'
import { pingChanges } from '../lib/chromeEmitters'
import { ChangedObjectStateEnum, StringDictionary } from '../lib/definitions'


interface Props
{
  selectedCommand: string,
  isModalOpen: boolean,
  setIsModalOpen: ( newState: boolean ) => void,
  keybindsState: StringDictionary,
  setKeybindsState: any, // ! - use proper type
}

export default function EditModal( { selectedCommand, isModalOpen, setIsModalOpen, keybindsState, setKeybindsState }: Props ) {

  const [ inputSuccessString, setInputSuccessString ] = useState<string | null>( null )
  const [ inputErrorString,   setInputErrorString ]   = useState<string | null>( null )
  const [ pressedKey, setPressedKey ] = useState( DEFAULT_PRESSED_KEY ) // ? this is only to display this to user

  // this only exists to autofocus so inputs are immediate
  const modalRef = useRef( null )
  useEffect( () => {
    if ( !isModalOpen ) return

    const el = modalRef?.current as HTMLElement | null
    if ( el )
      el.focus()
    
  }, [ isModalOpen ] )

  useEffect( () => {
    setInputErrorString( null )
    setInputSuccessString( null )

    if ( pressedKey === DEFAULT_PRESSED_KEY ) return
    if ( !canUseKey() ) setInputErrorString( `"${pressedKey}" cannot be used ` )
    else setInputSuccessString( `"${pressedKey}" can be used! Close to confirm.` )
  }, [ pressedKey ] )

  let currentKey = ""
  if ( keybindsState !== null )
    currentKey = keybindsState[ selectedCommand ]
  
  function handleCloseModal()
  {
    if ( canUseKey() )
    {
      setKeybindsState( () => {
        const newState = {...keybindsState}
        newState[ selectedCommand ] = pressedKey 

        storage.set( { "keybinds" : newState } )
        localStorage.setItem( "yt-keybinds", JSON.stringify( newState ) )
        
        console.log( `[BYS] :: Bound key "${pressedKey}" to ${selectedCommand}` )
        
        pingChanges( ChangedObjectStateEnum.KEYBINDS, newState )

        return newState 
      } )
    }

    setIsModalOpen( false )

    setInputErrorString( null )
    setInputSuccessString( null )
    setPressedKey( DEFAULT_PRESSED_KEY )
  }

  function handleModalInput( e: any ) // todo  - change to be actual type
  {
    const code = e.code
    setPressedKey( code )
  }

  function canUseKey()
  {
    console.dir( {keybindsState, pressedKey} )
    return (
      !EXCLUDED_KEY_BINDS.includes( pressedKey )                       &&
      !Object.values( keybindsState as Object ).includes( pressedKey )
    )
  }

  function showInputInfoString()
  {
    // either show the success, failure or 
    if ( inputSuccessString ) return <div className="--modal-input-success">{`👍 ${inputSuccessString}`}</div>
    if ( inputErrorString )   return <div className="--modal-input-error">{`❌ ${inputErrorString}`}</div>
    
    return <div className="--modal-input-error">{"\u00A0"}</div>
  }

  return (
    <dialog 
      className="--modal" 
      open={ isModalOpen } 
      style={ { display: (isModalOpen) ? "flex" : "none" }}
      ref={modalRef}
      onKeyDown={e => setPressedKey( e.code )}
    >
      <div className="--modal-content">

        <span className="--modal-header">
          <span className="--modal-header-text">
            Edit binding for 
            <span className="--modal-command">{selectedCommand}</span>
          </span>

          <span className="close-btn" onClick={handleCloseModal}>×</span>
        </span>

        <Separator/>

        <div className="input-wrapper">
          <label htmlFor="keybind-input" className="prevent-selection --modal-label">Current bind is <span>{currentKey}</span></label>
          <span className="">{pressedKey}</span>
          {showInputInfoString()}
          <div className="prevent-selection key-combo-warning">Does not support key combinations</div>
        </div>
      </div>
    </dialog>
  )
}
