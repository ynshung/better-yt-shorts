import { useEffect, useState } from "react"
import "../css/popup.css"
import Header from "./Header"
import KeybindsTable from "./KeybindsTable"
import OptionsTable from "./OptionsTable"
import Separator from "./Separator"
import PageIndicatorContainer from "./PageIndicatorContainer"
import { PolyDictionary, PopupPageNameEnum, StringDictionary } from "../lib/definitions"
import { keybinds, options } from "../lib/declarations"
import { retrieveKeybindsFromStorage, retrieveOptionsFromStorage } from "../lib/retrieveFromStorage"

// todo  - split this into its component parts

function Popup() {
  useEffect( () => {
    retrieveOptionsFromStorage( setOptionsState )
    retrieveKeybindsFromStorage( setKeybindsState )
  }, [] )
  
  const [ currentPage, setCurrentPage ] = useState( PopupPageNameEnum.KEYBINDS )
  const currentPageProps = { currentPage, setCurrentPage }

  const [ keybindsState, setKeybindsState ] = useState<StringDictionary>( keybinds ) 
  const [ optionsState, setOptionsState ]   = useState<PolyDictionary>(   options ) 


  const keybindsProp = { keybindsState, setKeybindsState }
  const optionsProp  = { optionsState, setOptionsState   }

  function getCurrentPageContent()
  {
    if ( currentPage === PopupPageNameEnum.KEYBINDS ) return <KeybindsTable {...keybindsProp} />
    if ( currentPage === PopupPageNameEnum.OPTIONS  ) return <OptionsTable  {...optionsProp } />
  }

  return (
    <div className="container" data-theme="light">
      <Header/>

      <Separator/>

      <PageIndicatorContainer {...currentPageProps} />
      
      <Separator/>

      { getCurrentPageContent() }

      <div id="edit-modal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <div>Edit keybind: <span className="modal-title" id="modal-title-span" /></div>
            <span className="close-btn">×</span>
          </div>
          <div className="separation-line" style={{opacity: '0.5'}} />
          <div className="input-wrapper">
            <label htmlFor="keybind-input" className="prevent-selection">Press desired key</label>
            <input type="text" id="keybind-input" />
            <div className="prevent-selection" style={{opacity: '0.8', fontSize: 10}}>Does not support key combinations</div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Popup
